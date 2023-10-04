import { ethers } from 'ethers';

export const connect = async () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum)

  await provider.send("eth_requestAccounts", []);

  const signer = provider.getSigner();

  const addr = await signer.getAddress();
  console.log('connected', addr);
}