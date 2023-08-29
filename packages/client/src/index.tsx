import { setup } from "./mud/setup";
import mudConfig from "contracts/mud.config";
import ReactDOM from "react-dom/client";
import { App } from './App';
import './common.scss';

const {
  network,
} = await setup();

// Components expose a stream that triggers when the component is updated.


const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("React root not found");
const root = ReactDOM.createRoot(rootElement);

setup().then((result) => {
  root.render(<App/>)
});


// https://vitejs.dev/guide/env-and-mode.html
if (import.meta.env.DEV) {
  const { mount: mountDevTools } = await import("@latticexyz/dev-tools");
  mountDevTools({
    config: mudConfig,
    publicClient: network.publicClient,
    walletClient: network.walletClient,
    latestBlock$: network.latestBlock$,
    blockStorageOperations$: network.blockStorageOperations$,
    worldAddress: network.worldContract.address,
    worldAbi: network.worldContract.abi,
    write$: network.write$,
    recsWorld: network.world,
  });
}
