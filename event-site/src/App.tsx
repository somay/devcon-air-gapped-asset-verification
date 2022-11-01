import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import {
  EVENT_SITE_DID,
  EVENT_SITE_KID,
  EVENT_SITE_PRIVATE_KEY,
  EVENT_SITE_ADDRESS,
  CLIENT_ID,
  ERC721_CONTRACT_ADDRESS,
  INFURA_ENDPOINT
} from "./const";
import { makeUrl } from "./siop";
import queryString from "query-string";
import { verifyJWT } from "did-jwt";

import { QRCodeSVG } from "qrcode.react";
import { Resolver } from "did-resolver";
import { getResolver as getEthrResolver } from "ethr-did-resolver";
import { Base64 } from "js-base64";
import { utils, Contract, getDefaultProvider} from "ethers";

const CONTRACT_ADDRESS = ERC721_CONTRACT_ADDRESS;

class VerificationError extends Error {};

const getResolver = () => {
  const ethrResolver = getEthrResolver({
    networks: [
      {
        name: "mainnet",
        rpcUrl: INFURA_ENDPOINT,
      },
    ],
  });
  const resolver = new Resolver({ ...ethrResolver });
  return resolver;
};

enum RenderState {
  initializing,
  displayingQRCode,
  verifying,
  allDone
}

function App() {
  const [renderState, setRenderState] = useState<RenderState>(RenderState.initializing);
  const [url, setUrl] = useState<string>("");
  const [credentialForDisplay, setCredentialForDisplay] = useState<string>("");
  const [idTokenPayload, setIdTokenPayload] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [verificationSuccess, setVerificationSuccess] = useState<string>('');

  const queryERC721Contract = async (tokenId: number) => {
    // must include any fragment we wish to use
    const abi = [
      // Read-Only Functions
      // "function balanceOf(address owner) view returns (uint256)",
      // "function decimals() view returns (uint8)",
      // "function symbol() view returns (string)",
      "function ownerOf(uint256 _tokenId) view returns (address)",

      // Authenticated Functions
      // "function transfer(address to, uint amount) returns (bool)",

      // Events
      // "event Transfer(address indexed from, address indexed to, uint amount)",
    ];

    // This can be an address or an ENS name
    // const address = "0xff04b6fBd9FEcbcac666cc0FFfEed58488c73c7B";
    const address = CONTRACT_ADDRESS;

    const provider = getDefaultProvider()
    // Read-Only; By connecting to a Provider, allows:
    // - Any constant function
    // - Querying Filters
    // - Populating Unsigned Transactions for non-constant methods
    // - Estimating Gas for non-constant (as an anonymous sender)
    // - Static Calling non-constant methods (as anonymous sender)
    console.log(JSON.stringify(tokenId))

    const erc721 = new Contract(address, abi, provider);
    const ownerAddress = await erc721.ownerOf(tokenId)
    console.log(ownerAddress);

    return ownerAddress;

    // Read-Write; By connecting to a Signer, allows:
    // - Everything from Read-Only (except as Signer, not anonymous)
    // - Sending transactions for non-constant functions
    // const erc20_rw = new Contract(address, abi, signer);
  };

  const parseAndVerifyCredential = useCallback(async (vpToken: string, signedInAddress: string) => {
    const stringifiedJSON = Base64.decode(vpToken);
    console.log(stringifiedJSON);
    setCredentialForDisplay(stringifiedJSON);
    const jsonld = JSON.parse(stringifiedJSON);
    const { proof, ...payload } = jsonld;
    const { proofValue, eip712, verificationMethod } = proof;
    const { domain, primaryType, types, rest } = eip712;
    const { EIP712Domain, ...nonDomainTypes } = types;
    const recoveredSignerAddress = utils.verifyTypedData(
      domain,
      nonDomainTypes,
      payload,
      proofValue
    );
    console.log(recoveredSignerAddress);
    const expectedAddress = verificationMethod.split(":").pop();
    if (recoveredSignerAddress !== expectedAddress) {
      throw Error("public key does not match with recovered one");
    } else {
      // 2. Interpretting the content of the credentials
      const {delegation: {from: {address: fromAddress}, to: {address: toAddress}, nftTokenId}} = payload;
      // assert signedInAddress has been delegated.
      if (toAddress !== signedInAddress) {
        throw new VerificationError('nothing delegated to those who signed in')
      }
      console.log(nftTokenId);
      // assert the right delegated to signedInAddress is the ownership of the NFT (`nftTokenId`)
      const ownerAddress = await queryERC721Contract(nftTokenId);
      if (fromAddress !== ownerAddress) {
        throw new VerificationError('NFT owner is different from delegator')
      }

      setVerificationSuccess(`successfully verified your delegated NFT ownership. your address: ${signedInAddress}, NFT: ${nftTokenId} on the smart contract ${CONTRACT_ADDRESS}, the actual owner of it: ${ownerAddress}`)
    }
  }, []);

  useEffect(() => {
    console.log(CONTRACT_ADDRESS)
    let signedInAddress;
    const parsed = queryString.parse(window.location.hash);
    if (parsed.id_token) {
      if (renderState === RenderState.verifying || renderState === RenderState.allDone) {
        return
      }
      setRenderState(RenderState.verifying);
      (async () => {
        try {
          const id_token = parsed.id_token as string;
          const resolver = getResolver();
          const { payload } = await verifyJWT(id_token, {
            resolver,
            auth: true,
            audience: CLIENT_ID,
          });
          signedInAddress = payload.did.split(':').pop()
          setIdTokenPayload(JSON.stringify(payload, null, 2));

          // Credential Verification
          if (parsed.vp_token) {
            await parseAndVerifyCredential(parsed.vp_token as string, signedInAddress);
          }
        } catch (e) {
          console.error('id token verification failed')
          // @ts-expect-error
          setError(e.message);
          // throw new VerificationError(e as string);
        } finally {
          setRenderState(RenderState.allDone);
        }
      })();
    } else {
      if (renderState !== RenderState.initializing) {
        return;
      }
      (async () => {
        try {
          const host = "web+devcon://";
          const clientId = CLIENT_ID;
          const _url = await makeUrl(
            EVENT_SITE_DID,
            EVENT_SITE_KID,
            EVENT_SITE_PRIVATE_KEY as string,
            clientId as string,
            host
          );
          setUrl(_url);
          console.log(_url);
        } catch (e) {
          throw new VerificationError('makeUrl failed')
        } finally {
          setRenderState(RenderState.displayingQRCode);
        }
      })();
    }
  }, [parseAndVerifyCredential, renderState]);

  const switchRender = () => {
    if (renderState === RenderState.initializing) {
      return <p>Loading...</p>;
    } else if (renderState === RenderState.displayingQRCode) {
      return (
        <div>
          <h2>Scan the QR code below to verify your NFT ownership!</h2>
          <QRCodeSVG value={url} size={256} />
        </div>
      );
    } else if (renderState === RenderState.verifying) {
      return <p>Verifying Sign-in and Credentials...</p>
    } else if (renderState === RenderState.allDone) {
      return (<div>
        {verificationSuccess && <h3 style={{color: 'green'}}>{verificationSuccess}</h3>}
        {error && <h3 style={{color: 'red'}}>{error}</h3>}
        <h4>ID token</h4>
        <code>{idTokenPayload}</code>
        <h4>Credential</h4>
      <code>{credentialForDisplay}</code>
        </div>);
    }
  };

  return (
    <div className="App">
      <h1>Event Page</h1>
      {switchRender()}
    </div>
  );
}

export default App;
