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
if (true) {
  const { mount: mountDevTools } = await import("@latticexyz/dev-tools");
  const comp = [];
  network.world.components.forEach((c) => {
    if (comp.findIndex((item => item.id === c.id)) === -1) {
      comp.push(c);
    }
  });
  network.world.components = comp;
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
  console.log("mounted")
}
