#!/usr/bin/env ts-node
import { Address } from "@gnosis-guild/eth-sdk";
import {
  applyMembers,
  applyTargets,
  ChainId,
  chains,
  encodeRoleKey,
  fetchRole,
  fetchRolesMod,
  processPermissions,
  Role,
  RolesModifier,
  Target,
} from "zodiac-roles-sdk";
import { writeFile } from "fs";
import yargs from "yargs";
import "../globals";
import assert from "assert";
import { getAddress } from "ethers";

interface ApplyUpdates {
  chainId: ChainId;
  address: Address;
  owner: Address;
  role: Role;
  members: Address[];
  targets: Target[];
}

async function applyUpdates({ chainId, address, role, members, targets }: ApplyUpdates) {
  const comments: string[] = [];
  const logCall = (log: string) => comments.push(log);

  let calls: { to: `0x${string}`; data: `0x${string}` }[] = [];

  if (members) {
    calls = calls.concat(
      (
        await applyMembers(role.key, members, {
          chainId,
          address,
          mode: "replace",
          currentMembers: role.members,
          log: logCall,
        })
      ).map((data) => ({ to: address, data })),
    );
  }

  if (targets) {
    calls = calls.concat(
      (
        await applyTargets(role.key, targets, {
          chainId,
          address,
          mode: "replace",
          currentTargets: role.targets,
          log: logCall,
        })
      ).map((data) => ({ to: address, data })),
    );
  }

  return calls;
}

function exportCalls(calls: `0x${string}`[], filePath = "test/data/permissions.json") {
  const data = JSON.stringify(calls, null, 2);

  writeFile(filePath, data, "utf8", (err) => {
    if (err) throw err;
    // Optionally log or do something on success
    // console.log('Calls exported successfully.');
  });
}

async function dumpCallsFromPermissions(modInfo: RolesModifier, roleArg: string, chainId: ChainId) {
  const permissions: Permissions = (await import(`../../roles/${roleArg}/permissions`)).default;

  const members: `0x${string}`[] = (await import(`../../roles/${roleArg}/members`)).default;

  const awaitedPermissions = await Promise.all(permissions);
  const { targets } = processPermissions(awaitedPermissions);

  const roleKey = encodeRoleKey(roleArg) as `0x${string}`;
  let currentRole = await fetchRole({ address: modInfo.address, chainId, roleKey });
  if (!currentRole) {
    console.warn(`No Roles modifier found for this roleKey: using empty Role config`);
    currentRole = {
      key: roleKey,
      members: [],
      targets: [],
      annotations: [],
      lastUpdate: 0
    }
  }

  const calls = (
    await applyUpdates({
      chainId: chainId,
      address: modInfo.address,
      owner: modInfo.avatar,
      role: currentRole,
      members: members,
      targets: targets,
    })
  ).map((call) => call.data);

  exportCalls(calls, `test/roles/${roleArg}/permissions.json`);
}

function parseMod(modArg: string) {
  const components = modArg.trim().split(":");
  assert(components.length === 2, `Invalid prefixed address: ${modArg}`);
  const [chainPrefix, modAddress] = components;

  const chainId = Object.keys(chains)
    .map((key) => parseInt(key) as ChainId)
    .find((id) => chains[id].prefix === chainPrefix);
  assert(chainId, `Chain is not supported: ${chainPrefix}`);

  // validates a valid ethereum address
  const address = getAddress(modAddress!) as `0x${string}`;

  return { chainId, chainPrefix, address };
}

export async function updateCalls(roleArg: string, modArg: string) {
  const { chainId, chainPrefix, address } = parseMod(modArg);

  const modInfo = await fetchRolesMod({ address, chainId });
  if (!modInfo) {
    console.warn(`No Roles modifier has been indexed at ${modArg} yet`);
    return;
  }
  dumpCallsFromPermissions(modInfo, roleArg, chainId);
}

async function main() {
  const args = await yargs(process.argv.slice(2))
    .usage("$0 <role> <chain-prefix>:<mod-address>")
    .positional("role", {
      demandOption: true,
      describe: "The role key, i.e., the name of the folder with configuration to apply",
      type: "string",
    })
    .positional("mod", {
      demandOption: true,
      describe: 'The chain-prefixed address of the Roles modifier, e.g. "eth:0x1234...5678"',
      type: "string",
    }).argv;
  const [roleArg, modArg] = args._ as [string, `0x${string}`, string];
  updateCalls(roleArg, modArg);
}

main();

