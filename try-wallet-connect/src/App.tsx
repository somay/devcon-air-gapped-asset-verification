/* Code in this file is heavily copied from:
   https://github.com/WalletConnect/web-examples/blob/main/dapps/react-dapp-v2/src/contexts/ClientContext.tsx
*/

import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import Client from "@walletconnect/sign-client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { getAppMetadata, getSdkError } from "@walletconnect/utils";
import { PairingTypes, SessionTypes } from "@walletconnect/types";
import CredentialSharingQRCode from "./CredentialSharingQRCode";
import {
  DOMAIN,
  makeCredential,
  makeParameter,
  makeProof,
  PRIMARY_TYPE,
  TYPES,
} from "./credential";
import { Base64 } from "js-base64";
import { utils } from "ethers";
import CreateCredentialForm from "./CreateCredentialForm";

const PROJECT_ID = "fdf8458b22324effa49201ce39d82a00";

function App() {
  const [session, setSession] = useState<SessionTypes.Struct>();
  const [chains, setChains] = useState<string[]>([]);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [client, setClient] = useState<Client>();
  const [signature, setSignature] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [pairings, setPairings] = useState<PairingTypes.Struct[]>([]);
  const [isInitializing, setIsInitializing] = useState(false);
  const [connected, setConnected] = useState<boolean>(false);
  const [valid, setValid] = useState<string>("");

  const onSessionConnected = useCallback(
    async (_session: SessionTypes.Struct) => {
      const allNamespaceAccounts = Object.values(_session.namespaces)
        .map((namespace) => namespace.accounts)
        .flat();
      const allNamespaceChains = Object.keys(_session.namespaces);

      setSession(_session);
      setChains(allNamespaceChains);
      setAccounts(allNamespaceAccounts);
      setConnected(true);
      console.log(JSON.stringify(allNamespaceAccounts, null, 2));
      // await getAccountBalances(allNamespaceAccounts);
    },
    []
  );

  const reset = () => {
    setSession(undefined);
    // setBalances({});
    setAccounts([]);
    setChains([]);
    setChains([]);
    setSignature("");
    setUrl("");
    setConnected(false);
    // setRelayerRegion(DEFAULT_RELAY_URL!);
  };

  const connect = useCallback(
    async (pairing: any) => {
      if (typeof client === "undefined") {
        throw new Error("WalletConnect is not initialized");
      }
      console.log("connect, pairing topic is:", pairing?.topic);
      try {
        // const requiredNamespaces = getRequiredNamespaces(chains);
        // console.log(
        //   "requiredNamespaces config for connect:",
        //   requiredNamespaces
        // );

        const { uri, approval } = await client.connect({
          pairingTopic: pairing?.topic,
          requiredNamespaces: {
            eip155: {
              methods: [
                // "eth_sendTransaction",
                // "eth_signTransaction",
                // "eth_sign",
                // "personal_sign",
                "eth_signTypedData",
              ],
              chains: ["eip155:1"],
              events: ["chainChanged", "accountsChanged"],
            },
          },
        });

        // Open QRCode modal if a URI was returned (i.e. we're not connecting an existing pairing).
        if (uri) {
          QRCodeModal.open(uri, () => {
            console.log("EVENT", "QR Code Modal closed");
          });
        }

        const session = await approval();
        console.log("Established session:", session);
        await onSessionConnected(session);
        // Update known pairings after session is connected.
        setPairings(client.pairing.getAll({ active: true }));
      } catch (e) {
        console.error(e);
        // ignore rejection
      } finally {
        // close modal in case it was open
        QRCodeModal.close();
      }
    },
    [chains, client, onSessionConnected]
  );

  const _subscribeToEvents = useCallback(
    async (_client: Client) => {
      if (typeof _client === "undefined") {
        throw new Error("WalletConnect is not initialized");
      }

      _client.on("session_ping", (args) => {
        console.log("EVENT", "session_ping", args);
      });

      _client.on("session_event", (args) => {
        // Handle session events, such as "chainChanged", "accountsChanged", etc.
        console.log("EVENT", "session_event", args);
      });

      _client.on("session_update", ({ topic, params }) => {
        console.log("EVENT", "session_update", { topic, params });
        const { namespaces } = params;
        const _session = _client.session.get(topic);
        const updatedSession = { ..._session, namespaces };
        onSessionConnected(updatedSession);
      });

      _client.on("session_delete", () => {
        console.log("EVENT", "session_delete");
        reset();
      });
    },
    [onSessionConnected]
  );

  const _checkPersistedState = useCallback(
    async (_client: Client) => {
      if (typeof _client === "undefined") {
        throw new Error("WalletConnect is not initialized");
      }
      // populates existing pairings to state
      setPairings(_client.pairing.getAll({ active: true }));
      console.log(
        "RESTORED PAIRINGS: ",
        _client.pairing.getAll({ active: true })
      );

      if (typeof session !== "undefined") return;
      // populates (the last) existing session to state
      if (_client.session.length) {
        const lastKeyIndex = _client.session.keys.length - 1;
        const _session = _client.session.get(
          _client.session.keys[lastKeyIndex]
        );
        console.log("RESTORED SESSION:", _session);
        await onSessionConnected(_session);
        return _session;
      }
    },
    [session, onSessionConnected]
  );

  const createClient = useCallback(async () => {
    try {
      setIsInitializing(true);

      const _client = await Client.init({
        // logger: DEFAULT_LOGGER,
        // relayUrl: relayerRegion,
        projectId: PROJECT_ID,
        // metadata: getAppMetadata() || DEFAULT_APP_METADATA,
      });

      console.log("CREATED CLIENT: ", _client);
      // console.log("relayerRegion ", relayerRegion);
      setClient(_client);
      // prevRelayerValue.current = relayerRegion;
      await _subscribeToEvents(_client);
      await _checkPersistedState(_client);
    } catch (err) {
      throw err;
    } finally {
      setIsInitializing(false);
    }
  }, [_checkPersistedState, _subscribeToEvents]);
  // }, [_checkPersistedState, _subscribeToEvents, relayerRegion]);

  const sign = useCallback(
    async (tokenId: number, lifetime: number, delegatee: string) => {
      if (typeof client === "undefined" || typeof session === "undefined") {
        return;
      }
      if (accounts.length < 1) {
        return;
      }

      // validateDelegatee(delegatee);

      console.log("start sign...");
      let payload = {
        "@context": ["https://schema.org", "https://w3id.org/security/v2"],
        "@type": "Person",
        delegation: {
          from: {
            name: "Cold Wallet",
            address: accounts[0].split(":").pop(),
          },
          to: {
            name: "Hot Wallet",
            address: delegatee,
          },
          nftTokenId: tokenId,
        },
      } as any;

      let expirationDate;
      if (lifetime > 0) {
        expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 1);
        payload.expirationDate = expirationDate.toISOString();
      }

      const signatureHex = await client.request<string>({
        topic: session.topic,
        chainId: "eip155:1",
        request: {
          method: "eth_signTypedData",
          params: [accounts[0], JSON.stringify(makeParameter(payload))],
        },
      });
      const proof = makeProof(
        signatureHex,
        `did:ethr:${accounts[0]}`,
        DOMAIN,
        PRIMARY_TYPE,
        TYPES
      );
      const vc = makeCredential(payload, proof);
      // Let's encode JSON-LD into base64
      const vcEncoded = Base64.encode(JSON.stringify(vc), true);
      setSignature(signatureHex);
      const sharingUrl = makeCredentialSharingURL(vcEncoded);
      console.log(sharingUrl);

      const { EIP712Domain, ...nonDomainTypes } = TYPES;

      const valid = utils.verifyTypedData(
        DOMAIN,
        nonDomainTypes,
        payload,
        signatureHex
      );
      setValid(valid);
      setUrl(sharingUrl);
      console.log(valid);
    },
    [session, client, accounts, signature]
  );

  const disconnect = useCallback(async () => {
    if (typeof client === "undefined") {
      throw new Error("WalletConnect is not initialized");
    }
    if (typeof session === "undefined") {
      throw new Error("Session is not connected");
    }
    await client.disconnect({
      topic: session.topic,
      reason: getSdkError("USER_DISCONNECTED"),
    });
    // Reset app state after disconnect.
    reset();
  }, [client, session]);

  useEffect(() => {
    if (!client) {
      // if (!client || prevRelayerValue.current !== relayerRegion) {
      createClient();
    }
  }, [client, createClient]);

  const makeCredentialSharingURL = (text: string) => {
    return `web+devcon://?vpToken=${text}`;
  };

  const showQRCode = () => {
    disconnect();
    reset();
  };

  const switchComponent = () => {
    if (isInitializing) {
      return <h2>Initializing...</h2>;
    } else if (!connected) {
      return <h2 onClick={connect}>connect</h2>;
    } else if (signature === "") {
      return (
        <div>
          <h2>Issue Credentials</h2>
          <p>Fill the form below.</p>
          {/* <h2 onClick={sign}>create credentials</h2> */}
          <CreateCredentialForm handleClick={sign} />
          <br />
          <button onClick={showQRCode} title="Back to the previous page">
            Back to the previous page
          </button>
        </div>
      );
    } else if (url !== "") {
      return <CredentialSharingQRCode text={url}></CredentialSharingQRCode>;
    }
  };

  return <div className="App">{switchComponent()}</div>;
}

export default App;
