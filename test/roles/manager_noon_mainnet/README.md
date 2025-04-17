# ManagerNoonMainnet Test

This test verifies permissions for the `manager_noon_mainnet` role on the Ethereum mainnet, using the Zodiac Roles Modifier deployed there.

## Setup Details

During the `setUp()`, this test:

1. Loads permission definitions from `test/roles/manager_noon_mainnet/permissions.json`.

2. Applies the permissions to the given role using `applyPermissionsOnRole`.

Note: The applied calls represents the permissions diff between existing permissions and the new target permission setup

## Regenerating `permissions.json`

If the permissions have changed or need to be updated, you can regenerate the file containing the updating calls with the following commands:

```bash
yarn generate
```

This runs from `package.json` script:

```json
"generate": "yarn updateCalls manager_noon_mainnet eth:0xf2BeE2B441ACF54204c25086792Cc94a04193089"
```

Which creates/updates the `permissions.json` file at:

```
test/roles/manager_noon_mainnet/permissions.json
```

This produces the exact same calls you would get using `yarn apply manager_noon_mainnet eth:0xf2BeE2B441ACF54204c25086792Cc94a04193089` and dumps them into a json file instead of opening up the browser diff view.

Then, the calls are loaded from the test file

## How to run test

First, define a rpc url:

```bash
export RPC_URL=https://rpc...
```

Then, run tests with:

```
forge test --fork-url $RPC_URL
```
