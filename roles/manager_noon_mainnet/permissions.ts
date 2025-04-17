import { allowErc20Approve } from "../../lib/conditions";
import { c } from "zodiac-roles-sdk";
import contracts from "../../contracts";

const VAULT_TACUSN = "0x7895a046b26cc07272b022a0c9bafc046e6f6396";
const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

const sUSN = contracts.mainnet.noon.susn;
const USN = "0xdA67B4284609d2d48e5d10cfAc411572727dc1eD";

const WITHDRAW_HANDLER = contracts.mainnet.noon.withdrawalhandler;
const BUNNI_HUB = contracts.mainnet.bunni.hub;
const EULER_CONNECTOR = contracts.mainnet.euler.connector;

// Bunni pool key for USDT/USN
const BUNNI_POOL_KEY_USDT_USN = {
  currency0: USN,
  currency1: USDT,
  fee: 0,
  tickSpacing: 10,
  hooks: "0x0000fE59823933AC763611a69c88F91d45F81888"
};

export default [
  // vault wind/uwind
  ...allowErc20Approve([USDT], [VAULT_TACUSN]), // manage approval for redemption from safe to vault
  {
    ...allow.mainnet.lagoon.vault.settleRedeem(undefined),
    targetAddress: VAULT_TACUSN,
  },
  {
    ...allow.mainnet.lagoon.vault.settleDeposit(undefined),
    targetAddress: VAULT_TACUSN,
  },
  {
    ...allow.mainnet.lagoon.vault.close(),
    targetAddress: VAULT_TACUSN,
  },
  {
    ...allow.mainnet.lagoon.vault.initiateClosing(),
    targetAddress: VAULT_TACUSN,
  },
  {
    ...allow.mainnet.lagoon.vault.claimSharesOnBehalf(),
    targetAddress: VAULT_TACUSN,
  },
  // stake usn into susn
  ...allowErc20Approve([USN], [sUSN]),
  allow.mainnet.noon.susn.deposit(undefined, c.avatar),
  // withdraw susn
  allow.mainnet.noon.susn.withdraw(undefined, WITHDRAW_HANDLER, c.avatar),
  // claim withdrawal
  allow.mainnet.noon.withdrawalhandler.claimWithdrawal(undefined),

  // bunni hub approval
  ...allowErc20Approve([USN], [BUNNI_HUB]),
  ...allowErc20Approve([USDT], [BUNNI_HUB]),

  // euler connector batch
  allow.mainnet.euler.connector.batch(undefined),

] satisfies Permissions;
