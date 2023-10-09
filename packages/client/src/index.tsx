import { setup } from "./mud/setup";
import mudConfig from "contracts/mud.config";
import ReactDOM from "react-dom/client";
import { App } from './App';
import './common.scss';
import { world } from '@/mud/world';
import { MUDProvider } from "@/mud/MUDContext";
const {
  network,
} = await setup();

// Components expose a stream that triggers when the component is updated.


const rootElement = document.getElementById("root");
setup().then(async (result) => {
  root.render(
    <MUDProvider value={result}>
      <App/>
    </MUDProvider>
)
});
if (!rootElement) throw new Error("React root not found");

const root = ReactDOM.createRoot(rootElement);


// https://vitejs.dev/guide/env-and-mode.html
// if (import.meta.env.DEV) {
//   const { mount: mountDevTools } = await import("@latticexyz/dev-tools");
//   console.log(network.world, 'world');
//   const s = new Set();
//   network.world.components.forEach((c, index) => {
//     s.add(c.id);
//   })
//   console.log(s.size, 'set');
//   mountDevTools({
//     config: mudConfig,
//     publicClient: network.publicClient,
//     walletClient: network.walletClient,
//     latestBlock$: network.latestBlock$,
//     blockStorageOperations$: network.blockStorageOperations$,
//     worldAddress: network.worldContract.address,
//     worldAbi: network.worldContract.abi,
//     write$: network.write$,
//     recsWorld: network.world,
//   });
// }
