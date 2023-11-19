import { setup } from "./mud/setup";
import mudConfig from "contracts/mud.config";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./common.scss";
import { world } from "@/mud/world";
import { MUDProvider } from "@/mud/MUDContext";
const { network } = await setup();

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("React root not found");
const root = ReactDOM.createRoot(rootElement);

setup().then(async (result) => {
  console.log("result", result);
  root.render(
    <MUDProvider value={result}>
      <App />
    </MUDProvider>
  );
  // if (!import.meta.env.DEV) {
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
    localStorage.setItem("mud-dev-tools-shown", 'false');
  // }
  
});
