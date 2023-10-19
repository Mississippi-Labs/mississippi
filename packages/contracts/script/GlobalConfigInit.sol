// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {console} from "forge-std/console.sol";
import {IWorld} from "../src/codegen/world/IWorld.sol";
import {GlobalConfig} from "../src/codegen/Tables.sol";
import { GLOBAL_CONFIG_KEY } from "../src/Constants.sol";

library GlobalConfigInit {
    function initGlobalConfig(IWorld _world) internal {
        address userContract = 0x0d9B17c2A22539101797db13EAE7d38A8f8A511F;
        GlobalConfig.setUserContract(
            _world,
            GLOBAL_CONFIG_KEY, //key
            userContract
        );
    }
}