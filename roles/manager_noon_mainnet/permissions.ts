import { allowErc20Approve } from "../../lib/conditions";

const VAULT_TACUSN = "0x4439307396c998258d55349b90abd2177289118d";
const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

export default [
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
] satisfies Permissions;
