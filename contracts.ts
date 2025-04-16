import type { Contracts } from "./.lib/types";

export default {
  mainnet: {
    lagoon: {
      vault: "0x7895a046b26cc07272b022a0c9bafc046e6f6396", //0xe296195cbd7affb6477c527dcc626a278c389560
    },
    noon: {
      susn: "0xE24a3DC889621612422A64E6388927901608B91D",
      withdrawalhandler: "0x0DaBc0D9B270c9B0C4C77AaCeAa712b56D0F9178",
    },
    bunni: {
        hub: "0x000000DCeb71f3107909b1b748424349bfde5493",
      }
  },
} satisfies Contracts;
