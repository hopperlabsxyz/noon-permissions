// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.8.28;

import "@forge-std/Test.sol";
import "@forge-std/console.sol";
import {VmSafe} from "@forge-std/Vm.sol";
import {TestAvatar} from "@test/TestAvatar.sol";
import {IRoles} from "@test/interfaces/IRoles.sol";
import {ZodiacHelpers} from "@test/ZodiacHelpers.t.sol";

contract BaseTest is ZodiacHelpers {
    constructor() {}
}
