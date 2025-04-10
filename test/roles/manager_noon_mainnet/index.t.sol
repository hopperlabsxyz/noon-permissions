// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.8.28;

import {BaseTest, IRoles} from "@test/Base.t.sol";
import {TestAvatar} from "@test/TestAvatar.sol";
import {Vault} from "@test/interfaces/IVault.sol";
import "@forge-std/Test.sol";

address constant TARGET = 0x4439307396c998258d55349b90abd2177289118d; // tacUSN
address constant ASSET = 0xdAC17F958D2ee523a2206206994597C13D831ec7; // USDT

contract ManagerNoonMainnet is BaseTest {
    function setUp() public {
        avatar = 0xA766CdA5848FfD7D33cE3861f6dc0A5EE38f3550;
        role = IRoles(0xf2BeE2B441ACF54204c25086792Cc94a04193089);
        roleOwner = avatar;
        manager = address(0xdead); // tmp while waiting for addresses from Lars
        ROLE_KEY = "manager_noon_mainnet";

        bytes[] memory permissions = parsePermissions(
            string.concat("test/roles/manager_noon_mainnet/permissions.json")
        );
        applyPermissionsOnRole(permissions);
    }

    function test_approve_underlying() public {
        // test to use approve on vault underlying
        bytes memory data = abi.encodeWithSignature(
            "approve(address,uint256)",
            TARGET,
            10
        );
        vm.prank(manager);
        role.execTransactionWithRole(ASSET, 0, data, 0, ROLE_KEY, false);
    }

    function test_settle_deposit() public {
        // test to use settle deposit on vault underlying
        bytes memory data = abi.encodeWithSelector(
            Vault(TARGET).settleDeposit.selector,
            42
        );
        vm.prank(manager);
        role.execTransactionWithRole(TARGET, 0, data, 0, ROLE_KEY, false);
    }

    function test_settle_redeem() public {
        // test to use settle deposit on vault underlying
        bytes memory data = abi.encodeWithSelector(
            Vault(TARGET).settleRedeem.selector,
            42
        );
        vm.prank(manager);
        role.execTransactionWithRole(TARGET, 0, data, 0, ROLE_KEY, false);
    }

    function test_close() public {
        // test to close vault
        bytes memory data = abi.encodeWithSelector(
            Vault(TARGET).close.selector,
            42
        );
        vm.prank(manager);
        role.execTransactionWithRole(TARGET, 0, data, 0, ROLE_KEY, false);
    }
}
