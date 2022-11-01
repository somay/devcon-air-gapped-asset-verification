import Client from "@walletconnect/sign-client";

// copied from https://github.com/WalletConnect/web-examples/blob/8d2240f8d5d53181ba0cb610c323c145d0956bd2/dapps/react-dapp-v2/src/helpers/eip712.ts
// export const example = {
//   types: {
//     EIP712Domain: [
//       { name: "name", type: "string" },
//       { name: "version", type: "string" },
//       { name: "chainId", type: "uint256" },
//       { name: "verifyingContract", type: "address" },
//     ],
//     Persona: [
//       { name: "name", type: "string" },
//       { name: "wallet", type: "address" },
//     ],
//     Delegation: [
//       {
//         name: "from",
//         type: "Persona",
//       },
//       {
//         name: "to",
//         type: "Persona",
//       },
//     ],
//     VerifiableCredential: [
//       { "name": "@context", type: "string[]" },
//       { "name": "@type", type: "string" },
//       { name: 'delegation', type: 'Delegation'},
//       // { name: "from", type: "Person" },
//       // { name: "to", type: "Person" },
//       { name: "contents", type: "string" },
//     ],
//   },
//   primaryType: "VerifiableCredential",
//   domain: {
//     name: "Ether Mail",
//     version: "1",
//     chainId: 1,
//     verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
//   },
//   message: {
//     "@context": ["https://schema.org", "https://w3id.org/security/v2"],
//     "@type": "Person",
//     'delegation': {
//     from: { name: "Cow", wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826" },
//     to: { name: "Bob", wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB" },
//     },
//     contents: "Hello, Bob!",
//   },
// };

export const DOMAIN = {
  name: "Ether Mail",
  version: "1",
  chainId: 1,
  verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
};

export const PRIMARY_TYPE = "VerifiableCredential";
// export const PRIMARY_TYPE = example.primaryType;
// export const TYPES = example.types;
export const TYPES = {
  EIP712Domain: [
    {
      name: "name",
      type: "string",
    },
    {
      name: "version",
      type: "string",
    },
    {
      name: "chainId",
      type: "uint256",
    },
    {
      name: "verifyingContract",
      type: "address",
    },
  ],
  Persona: [
    {
      name: "name",
      type: "string",
    },
    {
      name: "address",
      type: "address",
    },
  ],
  Delegation: [
    {
      name: "from",
      type: "Persona",
    },
    {
      name: "to",
      type: "Persona",
    },
    {
      name: "nftTokenId",
      type: "uint256",
    },
  ],
  VerifiableCredential: [
    { name: "@context", type: "string[]" },
    { name: "@type", type: "string" },
    // { "name": "expirationDate", type: "string" },
    { name: "delegation", type: "Delegation" },
  ],
};

export const makeParameter = (credentialPayload: any) => {
  const param = {
    types: TYPES,
    primaryType: PRIMARY_TYPE,
    domain: DOMAIN,
    message: credentialPayload,
  };

  return param;
};

export const signCredential = async (
  client: Client,
  topic: string,
  address: string,
  params: any
) => {
  const result = await client.request<string>({
    topic: topic,
    chainId: "eip155:1",
    request: {
      method: "eth_signTypedData",
      params: [address, params],
    },
  });
  return result;
};

export const makeProof = (
  signature: string,
  publicKeyUri: string,
  domain: any,
  primaryType: string,
  types: any
) => {
  return {
    created: "2021-08-30T13:28:02Z",
    eip712: {
      domain: domain,
      primaryType: primaryType,
      types: types,
    },
    proofPurpose: "assertionMethod",
    proofValue: signature,
    type: "EthereumEip712Signature2021",
    verificationMethod: publicKeyUri,
  };
};

export const makeCredential = (payload: any, proof: any) => {
  return { ...payload, proof: proof };
};
