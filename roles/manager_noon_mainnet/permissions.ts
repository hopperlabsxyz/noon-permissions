import { allowErc20Approve } from "../../lib/conditions";
import { forAll, c } from "zodiac-roles-sdk";

const VAULT_TACUSN = "0x7895a046b26cc07272b022a0c9bafc046e6f6396";
const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

const sUSN = "0xE24a3DC889621612422A64E6388927901608B91D";
const USN = "0xdA67B4284609d2d48e5d10cfAc411572727dc1eD";

const WITHDRAW_HANDLER = "0x0DaBc0D9B270c9B0C4C77AaCeAa712b56D0F9178";

// Bunni hub address
const BUNNI_HUB = "0x000000DCeb71f3107909b1b748424349bfde5493";

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
  // bunni hub deposit/withdraw
  allow.mainnet.bunni.hub.deposit({
    poolKey: BUNNI_POOL_KEY_USDT_USN,
    recipient: c.avatar,
    amount0Desired: undefined,
    amount1Desired: undefined,
    amount0Min: undefined,
    amount1Min: undefined,
    deadline: undefined
  }),
  allow.mainnet.bunni.hub.withdraw({
    poolKey: BUNNI_POOL_KEY_USDT_USN,
    recipient: c.avatar,
    shares: undefined,
    amount0Min: undefined,
    amount1Min: undefined,
    deadline: undefined
  }),

  // euler connector batch
  allow.mainnet.euler.connector.batch(undefined),


] satisfies Permissions;
