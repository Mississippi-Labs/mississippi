// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {console} from "forge-std/console.sol";
import {IWorld} from "../src/codegen/world/IWorld.sol";
import {GlobalConfig} from "../src/codegen/index.sol";
import { GLOBAL_CONFIG_KEY } from "../src/Constants.sol";

library GlobalConfigInit {
    function initGlobalConfig(IWorld _world,address _userContract,address _lootContract,address _pluginContract) internal {
        GlobalConfig.setUserContract(
            GLOBAL_CONFIG_KEY, //key
            _userContract
        );
        GlobalConfig.setLootContract(
            GLOBAL_CONFIG_KEY, //key
            _lootContract
        );
        GlobalConfig.setPluginContract(
            GLOBAL_CONFIG_KEY, //key
            _pluginContract
        );
    }
}
