// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {console} from "forge-std/console.sol";
import {IWorld} from "../src/codegen/world/IWorld.sol";
import {GlobalConfig} from "../src/codegen/Tables.sol";
import { GLOBAL_CONFIG_KEY } from "../src/Constants.sol";

library GlobalConfigInit {
    function initGlobalConfig(IWorld _world) internal {
        address userContract = 0x5FbDB2315678afecb367f032d93F642f64180aa3;
        GlobalConfig.setUserContract(
            _world,
            GLOBAL_CONFIG_KEY, //key
            userContract
        );
    }
}
