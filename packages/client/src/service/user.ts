import { ethers } from 'ethers';
import Mississippi from '../../abi/Mississippi.json';

export const uploadUserMove = async (x, y, steps) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum)

  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();

  const miss = new ethers.Contract('0xc86c785620e9d9a14374ea203b34b6312bce6d03', Mississippi, signer);

  const transaction = await miss.connect(signer).move([x, y, steps]);
  const tx = await transaction.wait(1);

  console.log(tx.events)

}