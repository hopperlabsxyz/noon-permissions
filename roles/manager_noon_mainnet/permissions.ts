import { allowErc20Approve } from "../../lib/conditions";

const VAULT_TACUSN = "0x7895a046b26cc07272b022a0c9bafc046e6f6396";
const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

const sUSN = "0xE24a3DC889621612422A64E6388927901608B91D";
const USN = "0xdA67B4284609d2d48e5d10cfAc411572727dc1eD";

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
] satisfies Permissions;
