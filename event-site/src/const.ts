// require('dotenv').config()
import env from "react-dotenv";
export const INFURA_ENDPOINT=env.INFURA_ENDPOINT
export const ERC721_CONTRACT_ADDRESS=env.ERC721_CONTRACT_ADDRESS
export const EVENT_SITE_ADDRESS=env.EVENT_SITE_ADDRESS
export const EVENT_SITE_PRIVATE_KEY=env.EVENT_SITE_PRIVATE_KEY

export const CLIENT_ID=env.CLIENT_ID

export const EVENT_SITE_DID =
  `did:ethr:${EVENT_SITE_ADDRESS}`;
export const EVENT_SITE_KID = `${EVENT_SITE_DID}#controller`;
