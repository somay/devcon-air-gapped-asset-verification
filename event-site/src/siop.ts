import { utils } from "ethers";

// const sign = () => {
//   const keyPair = new utils.SigningKey(EVENT_SITE_PRIVATE_KEY)

//   keyPair.signDigest()

// }

import { createJWS, ES256KSigner } from "did-jwt";

export const makeUrl = async (
  did: string,
  kid: string,
  privateKeyHex: string,
  clientId: string,
  host: string
) => {
  // WARNiNG: you must NOT do this in production code. confer the spec.
  const nonce = "0000000"; // INSECURE!
  const state = "1111111"; // INSECURE!

  const request = await generateJWT(did, kid, privateKeyHex, clientId);
  const clientIdEncoded = encodeURIComponent(clientId);

  const url = `${host}?response_type=id_token&scope=openid%20did_authn&client_id=${clientIdEncoded}&request=${request}&nonce=${nonce}&state=${state}`;
  return url;
};

export const generateJWT = (
  did: string,
  kid: string,
  privateKeyHex: string,
  clientId: string
  // jwksUri?: string,
): Promise<string> => {
  const header = {
    alg: "ES256K",
    typ: "JWT" as const,
    kid: kid,
  };
  const registration = {
    authorization_endpoint: "openid:",
    issuer: "https://self-issued.me/v2",
    response_types_supported: ["id_token"],
    scopes_supported: ["openid"],
    credential_formats_supported: ["jwt_vc"],
    subject_types_supported: ["pairwise"],
    subject_identifier_types_supported: ["did:ethr:"],
    id_token_signing_alg_values_supported: ["ES256K"],
    request_object_signing_alg_values_supported: ["ES256K"],
    redirect_uris: [clientId],
    // jwks_uri: jwksUri,
    did: did,
  };

  const request = {
    iss: did,
    response_type: "id_token",
    scope: "openid did_authn",
    client_id: clientId,
    registration: registration,
    redirect_uri: clientId,
    kid: kid,
  };

  console.log(JSON.stringify(request, null, 2));

  const fromHexString = (hexString: string) =>
    Uint8Array.from(
      // @ts-expect-error
      hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    );

  const privateKeyByteArray = fromHexString(
    privateKeyHex.substring("0x".length)
  );

  const signer = ES256KSigner(privateKeyByteArray);

  return createJWS(request, signer, header);
};
