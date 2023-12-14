import { Client } from "@web3mq/client";
import { ethers } from "ethers";

const password = "password";
const didType = 'metamask'


export const getClient = async (privateKey, rpc) => {
  privateKey = '0x893614f36825dec2d47395fb943d29780f79b9ef5520b765faa2eb009545f002'
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const wallet = new ethers.Wallet(privateKey, provider);
  const didValue = wallet.address.toLowerCase();

  await Client.init({
    connectUrl: '',
    app_key: 'ouaCANQoTTUEaZqo',
  });

  const { userid, userExist } = await Client.register.getUserInfo({
    did_value: didValue,
    did_type: 'eth',
  });
  console.log(userid, userExist);

  let localMainPrivateKey = localStorage.getItem('mainPrivateKey') || '';
  let localMainPublicKey = localStorage.getItem('mainPublicKey') || '';
  if (!userExist) {
    const { signContent: keysSignContent } = await Client.register.getMainKeypairSignContent({
      password,
      did_value: didValue,
      did_type: didType,
    });
    console.log(keysSignContent);

    const keysSignature = await wallet.signMessage(keysSignContent, didValue, didType);
    console.log(keysSignature);

    const { publicKey, secretKey } = await Client.register.getMainKeypairBySignature(
      keysSignature,
      password
    );

    console.log('publicKey', publicKey, 'secretKey', secretKey);

    localStorage.setItem('mainPrivateKey', secretKey);
    localStorage.setItem('mainPublicKey', publicKey);

    const { signContent } = await Client.register.getRegisterSignContent({
      userid,
      mainPublicKey: publicKey,
      didType,
      didValue,
    });

    const signature = await wallet.signMessage(
      signContent,
      didValue,
      didType
    );
    console.log('signature', signature);
    const params = {
      userid,
      didValue,
      mainPublicKey: publicKey,
      did_pubkey: '',
      didType,
      nickname: '',
      avatar_url: '',
      signature,
    }
    console.log(params)
    const registerRes = await Client.register.register(params);
    console.log(registerRes);
  }

  console.log({
    password,
    userid,
    did_value: didValue,
    did_type: didType,
    mainPublicKey: localMainPublicKey,
    mainPrivateKey: localMainPrivateKey,
  })
  const {
    tempPrivateKey,
    tempPublicKey,
    pubkeyExpiredTimestamp,
    mainPrivateKey,
    mainPublicKey,
  } = await Client.register.login({
    password,
    userid,
    didValue: didValue,
    didType: didType,
    mainPublicKey: localMainPublicKey,
    mainPrivateKey: localMainPrivateKey,
  });

  console.log({
    tempPrivateKey,
    tempPublicKey,
    pubkeyExpiredTimestamp,
    mainPrivateKey,
    mainPublicKey,
  })
  // 3. You must ensure that the Client.init initialization is complete and that you have a key pair
  const client = Client.getInstance({
    PrivateKey: tempPrivateKey,
    PublicKey: tempPublicKey,
    userid: userid,
  });
  return client;
}