import React, { useState, useEffect } from 'react';
import Logo from '@/assets/img/logo.png';
import './styles.scss';
import imgTelegram from '@/assets/img/icon_t.png';
import imgTwitter from '@/assets/img/icon_tw.png';
import imgDiscord from '@/assets/img/icon_d.png';
import UserAddress from '@/components/UserAddress';
import { useMUD } from '@/mud/MUDContext';
import { ethers } from 'ethers';
import { TRANSFER_GAS } from '@/config/chain';

interface IProps {
  onPlayBtnClick: () => void;
  onlyRight?: boolean;
}

let transfering = false

const HomeHeader = (props: IProps) => {
  const [select, setSelect] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('');

  const {
    components,
    systemCalls,
    network
  } = useMUD();

  const transferFun = async (to) => {
    if (transfering) return
    transfering = true
    let PRIVATE_KEY = ''
    if (network.walletClient?.chain?.id == 31337 || network.walletClient?.chain?.id == 33784) {
      PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
    } else if (network.walletClient?.chain?.id == 17001) {
      PRIVATE_KEY = '0x7f5f5b59608a084ae03db047c8c4cfa79898b37c69e1c028c1e310bb28e190fd'
    }
    let rpc = network.walletClient?.chain?.rpcUrls?.default?.http[0] || 'http://127.0.0.1:8545'
    let provider = new ethers.providers.JsonRpcProvider(rpc)
    let wallet = new ethers.Wallet(PRIVATE_KEY, provider)
    console.log(wallet, 'wallet')
    let transferGas = TRANSFER_GAS[network.walletClient?.chain?.id || 31337]
    wallet.sendTransaction({
      to,
      value: ethers.utils.parseEther(transferGas)
    }).then(res => {
      console.log(res, 'res')
      transfering = false
      getBalance()
    }).catch(err => {
      console.log(err)
    })
  }

  const getBalance = async () => {
    let balance = await network.publicClient.getBalance({
      address: network.walletClient.account.address
    })
    console.log(balance, 'balance')
    let walletBalance = 0
    if (balance.toString() == '0') {
      transferFun(network.walletClient.account.address)
    } else {
      walletBalance = (+ethers.utils.formatEther(balance.toString())).toFixed(2)
    }
    setWalletAddress(network.walletClient.account.address);
    setWalletBalance(walletBalance);
    localStorage.setItem('mi_user_address', network.walletClient.account.address)
    // 转成eth
  }

  useEffect(() => {
    if (network.walletClient?.account?.address) {
      getBalance()
    }
  }, [network.walletClient?.account?.address])

  const changeNetwork = (chainId) => {
    localStorage.setItem('chainId', chainId);
    // 返回首页并重新加载
    window.location.href = '/'
  }
  return (
    <div className="home-header" style={{background: props.onlyRight ? 'none' : '#020202'}}>
      {
        !props.onlyRight ? (
          <div className='home-header-l'>
          <a href="/">
            <img src={Logo} alt="MISSISSIPPI" className="header-logo"/>
            </a>
            
            <nav className="header-nav">
              <ul className="menu-lv1">
                {/* <li><a href="">Leaderboard</a></li> */}
                <li><a href="https://mississippi.gitbook.io/mississippi/" target='_blank'>Docs</a></li>
                <li className="menu-socials">
                  <a href="">Socials</a>
                  <ul className="menu-lv2">
                    <li>
                      <a href="https://twitter.com/0xMississippi" target="_blank" rel="noreferrer">Twitter</a>
                      <img src={imgTwitter} alt=""/>
                    </li>
                    <li>
                      <a href="https://discord.gg/rg9V8J49" target="_blank" title="coming soon">Discord</a>
                      <img src={imgDiscord} alt=""/>
                    </li>
                    
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        ) : <div className='home-header-l'></div>
      }
      <div className='select-network'>
        <button className="play-btn mi-btn" onClick={() => setSelect(true)}>{network?.walletClient?.chain?.name}</button>
        {
          select ? <div>
            <div className='network-list'>
              <div className='network-item' onClick={() => changeNetwork(33784)}>Mississippi Testnet</div>
              <div className='network-item' onClick={() => changeNetwork(17001)}>Redstone Testnet</div>
              <div className='network-item' >Starknet(Coming Soon)</div>
              {
                import.meta.env.DEV ? <div className='network-item' onClick={() => changeNetwork(31337)}>Foundry</div> : null
              }
            </div>
            <div className='mask' onClick={() => setSelect(false)}></div>
          </div> : null
        }
      </div>
      {
        walletAddress ?
          <UserAddress address={walletAddress} account={walletBalance + 'ETH'}/>
          :
          <button className="play-btn mi-btn" onClick={props.onPlayBtnClick}>PLAY NOW</button>
      }
    </div>
  );
};

export default HomeHeader;