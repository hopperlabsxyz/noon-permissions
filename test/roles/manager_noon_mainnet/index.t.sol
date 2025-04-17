// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.8.28;

import {BaseTest, IRoles} from "@test/Base.t.sol";
import {TestAvatar} from "@test/TestAvatar.sol";
import {Vault} from "@test/interfaces/IVault.sol";
import "@forge-std/Test.sol";

address constant TARGET = 0x7895A046b26CC07272B022a0C9BAFC046E6F6396; // tacUSN
address constant ASSET = 0xdAC17F958D2ee523a2206206994597C13D831ec7; // USDT

address constant sUSN = 0xE24a3DC889621612422A64E6388927901608B91D;
address constant USN = 0xdA67B4284609d2d48e5d10cfAc411572727dc1eD;
address constant EULER_CONNECTOR = 0x0C9a3dd6b8F28529d72d7f9cE918D493519EE383;

address constant BUNNI_HUB = 0x000000DCeb71f3107909b1b748424349bfde5493;
address constant WITHDRAW_HANDLER = 0x0DaBc0D9B270c9B0C4C77AaCeAa712b56D0F9178;

interface IEVC {
    struct BatchItem {
        address targetContract;
        address onBehalfOfAccount;
        uint256 value;
        bytes data;
    }

    function batch(BatchItem[] memory items) external payable;
}


contract ManagerNoonMainnet is BaseTest {
    function setUp() public {
        avatar = 0xA766CdA5848FfD7D33cE3861f6dc0A5EE38f3550;
        role = IRoles(0xf2BeE2B441ACF54204c25086792Cc94a04193089);
        roleOwner = avatar;
        // member of the role
        manager = address(0x7c615e12D1163fc0DdDAA01B51922587034F5C93);
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

    function test_approve_usn_on_susn() public {
        // test to use approve on vault underlying
        bytes memory data = abi.encodeWithSignature(
            "approve(address,uint256)",
            sUSN,
            10
        );
        vm.prank(manager);
        role.execTransactionWithRole(USN, 0, data, 0, ROLE_KEY, false);
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

    function test_initiateClosing() public {
        bytes memory data = abi.encodeWithSelector(
            Vault(TARGET).initiateClosing.selector
        );
        vm.prank(manager);
        role.execTransactionWithRole(TARGET, 0, data, 0, ROLE_KEY, false);
    }

    function test_deposit() public {
        bytes memory data = abi.encodeWithSignature(
            "deposit(uint256,address)",
            10,
            avatar
        );
        vm.prank(manager);
        role.execTransactionWithRole(sUSN, 0, data, 0, ROLE_KEY, false);

        data = abi.encodeWithSignature(
            "deposit(uint256,address)",
            10,
            address(0xdead)
        );
        vm.expectRevert();
        vm.prank(manager);
        role.execTransactionWithRole(sUSN, 0, data, 0, ROLE_KEY, false);
    }

    function test_euler_connector_batch() public {
        // Create a simple batch operation
        IEVC.BatchItem[] memory items = new IEVC.BatchItem[](1);
        items[0] = IEVC.BatchItem({
            targetContract: TARGET,
            onBehalfOfAccount: avatar,
            value: 0,
            data: abi.encodeWithSelector(Vault(TARGET).settleDeposit.selector, 42)
        });

        bytes memory data = abi.encodeWithSelector(
            IEVC(EULER_CONNECTOR).batch.selector,
            items
        );

        vm.prank(manager);
        role.execTransactionWithRole(EULER_CONNECTOR, 0, data, 0, ROLE_KEY, false);
    }

    function test_approve_bunni() public {
        // Test approving USN for Bunni hub
        bytes memory data = abi.encodeWithSignature(
            "approve(address,uint256)",
            BUNNI_HUB,
            10
        );
        vm.prank(manager);
        role.execTransactionWithRole(USN, 0, data, 0, ROLE_KEY, false);

        // Test approving USDT for Bunni hub
        data = abi.encodeWithSignature(
            "approve(address,uint256)",
            BUNNI_HUB,
            10
        );
        vm.prank(manager);
        role.execTransactionWithRole(ASSET, 0, data, 0, ROLE_KEY, false);
    }

    function test_susn_withdraw() public {
        // Test withdrawing from sUSN to withdrawal handler
        bytes memory data = abi.encodeWithSignature(
            "withdraw(uint256,address,address)",
            10,
            WITHDRAW_HANDLER,
            avatar
        );
        vm.prank(manager);
        role.execTransactionWithRole(sUSN, 0, data, 0, ROLE_KEY, false);

        // Test should revert if recipient is not withdrawal handler
        data = abi.encodeWithSignature(
            "withdraw(uint256,address,address)",
            10,
            address(0xdead),
            avatar
        );
        vm.expectRevert();
        vm.prank(manager);
        role.execTransactionWithRole(sUSN, 0, data, 0, ROLE_KEY, false);
    }

    function test_claim_withdrawal() public {
        // Test claiming withdrawal from withdrawal handler
        bytes memory data = abi.encodeWithSignature(
            "claimWithdrawal(uint256)",
            42
        );
        vm.prank(manager);
        role.execTransactionWithRole(WITHDRAW_HANDLER, 0, data, 0, ROLE_KEY, false);
    }
}
