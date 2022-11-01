import {Resolver} from 'did-resolver';
import {getResolver as getEthrResolver} from 'ethr-did-resolver';
import {ethers} from 'ethers';

export const getResolver = () => {
  const ethProvider = new ethers.providers.JsonRpcProvider(
    'https://mainnet.infura.io/v3/52ea84c5d6794fe4957e5dfb9b93f387',
  );

  const ethrResolver = getEthrResolver({
    networks: [{name: 'mainnet', provider: ethProvider}],
  });

  const resolver = new Resolver({...ethrResolver});
  return resolver;
};
