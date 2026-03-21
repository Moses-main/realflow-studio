import { encodeFunctionData, decodeFunctionResult, encodeAbiParameters, decodeAbiParameters, keccak256, toHex } from "viem";

export interface FunctionInput {
  type: string;
  name: string;
}

export interface FunctionOutput {
  type: string;
  name: string;
}

export interface FunctionFragment {
  name: string;
  inputs: FunctionInput[];
  outputs: FunctionOutput[];
  stateMutability: "pure" | "view" | "nonpayable" | "payable";
}

export const commonFunctions: Record<string, { 
  name: string; 
  inputs: readonly { type: string; name: string }[]; 
  outputs: readonly { type: string; name: string }[];
  stateMutability: "pure" | "view" | "nonpayable" | "payable";
}> = {
  balanceOf: {
    name: "balanceOf",
    inputs: [{ type: "address", name: "account" }],
    outputs: [{ type: "uint256", name: "balance" }],
    stateMutability: "view",
  },
  ownerOf: {
    name: "ownerOf",
    inputs: [{ type: "uint256", name: "tokenId" }],
    outputs: [{ type: "address", name: "owner" }],
    stateMutability: "view",
  },
  totalSupply: {
    name: "totalSupply",
    inputs: [],
    outputs: [{ type: "uint256", name: "" }],
    stateMutability: "view",
  },
  name: {
    name: "name",
    inputs: [],
    outputs: [{ type: "string", name: "" }],
    stateMutability: "view",
  },
  symbol: {
    name: "symbol",
    inputs: [],
    outputs: [{ type: "string", name: "" }],
    stateMutability: "view",
  },
  tokenURI: {
    name: "tokenURI",
    inputs: [{ type: "uint256", name: "tokenId" }],
    outputs: [{ type: "string", name: "" }],
    stateMutability: "view",
  },
  mint: {
    name: "mint",
    inputs: [
      { type: "address", name: "to" },
      { type: "uint256", name: "amount" },
      { type: "bytes", name: "data" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  transfer: {
    name: "transfer",
    inputs: [
      { type: "address", name: "to" },
      { type: "uint256", name: "amount" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
};

function getAbiForFunction(functionName: string) {
  const fragment = commonFunctions[functionName];
  if (!fragment) return null;

  return [
    {
      type: "function" as const,
      name: fragment.name,
      inputs: [...fragment.inputs],
      outputs: [...fragment.outputs],
      stateMutability: fragment.stateMutability,
    },
  ];
}

export function encodeFunctionCall(
  functionName: string,
  args: (string | number | bigint)[]
): `0x${string}` {
  try {
    const fragment = commonFunctions[functionName];
    if (!fragment) {
      throw new Error(`Unknown function: ${functionName}`);
    }

    const abi = getAbiForFunction(functionName);
    if (!abi) throw new Error("Invalid function");

    return encodeFunctionData({
      abi,
      functionName,
      args,
    });
  } catch (error) {
    throw new Error(`Failed to encode: ${error}`);
  }
}

export function decodeFunctionResultData(
  functionName: string,
  data: `0x${string}`
): unknown[] {
  try {
    const fragment = commonFunctions[functionName];
    if (!fragment) {
      throw new Error(`Unknown function: ${functionName}`);
    }

    const abi = getAbiForFunction(functionName);
    if (!abi) throw new Error("Invalid function");

    const result = decodeFunctionResult({
      abi,
      functionName,
      data,
    });

    return Array.isArray(result) ? result : [result];
  } catch (error) {
    throw new Error(`Failed to decode: ${error}`);
  }
}

export function encodeParams(
  types: readonly string[],
  values: (string | number | bigint | boolean)[]
): `0x${string}` {
  try {
    return encodeAbiParameters(
      types.map((type, i) => ({ type, name: `param${i}` })),
      values
    );
  } catch (error) {
    throw new Error(`Failed to encode parameters: ${error}`);
  }
}

export function decodeParams(
  types: readonly string[],
  data: `0x${string}`
): unknown[] {
  try {
    const result = decodeAbiParameters(
      types.map((type, i) => ({ type, name: `param${i}` })),
      data
    );
    return Array.isArray(result) ? result : [result];
  } catch (error) {
    throw new Error(`Failed to decode parameters: ${error}`);
  }
}

export function getFunctionSelector(functionName: string): string {
  const fragment = commonFunctions[functionName];
  if (!fragment) return "";

  const signature = `${fragment.name}(${fragment.inputs.map(i => i.type).join(",")})`;
  return signatureToSelector(signature);
}

export function signatureToSelector(signature: string): string {
  const hash = keccak256(toHex(signature));
  return hash.slice(0, 10);
}

export function getAbiSignature(fragment: FunctionFragment): string {
  const inputs = fragment.inputs.map(i => i.type).join(",");
  return `${fragment.name}(${inputs})`;
}

export const erc20Abi = [
  { name: "balanceOf", type: "function", inputs: [{ type: "address", name: "account" }], outputs: [{ type: "uint256" }], stateMutability: "view" },
  { name: "transfer", type: "function", inputs: [{ type: "address", name: "to" }, { type: "uint256", name: "amount" }], outputs: [{ type: "bool" }], stateMutability: "nonpayable" },
  { name: "approve", type: "function", inputs: [{ type: "address", name: "spender" }, { type: "uint256", name: "amount" }], outputs: [{ type: "bool" }], stateMutability: "nonpayable" },
  { name: "totalSupply", type: "function", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" },
  { name: "transferFrom", type: "function", inputs: [{ type: "address", name: "from" }, { type: "address", name: "to" }, { type: "uint256", name: "amount" }], outputs: [{ type: "bool" }], stateMutability: "nonpayable" },
  { name: "allowance", type: "function", inputs: [{ type: "address", name: "owner" }, { type: "address", name: "spender" }], outputs: [{ type: "uint256" }], stateMutability: "view" },
] as const;

export const erc1155Abi = [
  { name: "balanceOf", type: "function", inputs: [{ type: "address", name: "account" }, { type: "uint256", name: "id" }], outputs: [{ type: "uint256" }], stateMutability: "view" },
  { name: "balanceOfBatch", type: "function", inputs: [{ type: "address[]", name: "accounts" }, { type: "uint256[]", name: "ids" }], outputs: [{ type: "uint256[]" }], stateMutability: "view" },
  { name: "setApprovalForAll", type: "function", inputs: [{ type: "address", name: "operator" }, { type: "bool", name: "approved" }], outputs: [], stateMutability: "nonpayable" },
  { name: "isApprovedForAll", type: "function", inputs: [{ type: "address", name: "account" }, { type: "address", name: "operator" }], outputs: [{ type: "bool" }], stateMutability: "view" },
  { name: "safeTransferFrom", type: "function", inputs: [{ type: "address", name: "from" }, { type: "address", name: "to" }, { type: "uint256", name: "id" }, { type: "uint256", name: "amount" }, { type: "bytes", name: "data" }], outputs: [], stateMutability: "nonpayable" },
  { name: "safeBatchTransferFrom", type: "function", inputs: [{ type: "address", name: "from" }, { type: "address", name: "to" }, { type: "uint256[]", name: "ids" }, { type: "uint256[]", name: "amounts" }, { type: "bytes", name: "data" }], outputs: [], stateMutability: "nonpayable" },
  { name: "uri", type: "function", inputs: [{ type: "uint256", name: "tokenId" }], outputs: [{ type: "string" }], stateMutability: "view" },
] as const;

export const erc721Abi = [
  { name: "balanceOf", type: "function", inputs: [{ type: "address", name: "owner" }], outputs: [{ type: "uint256" }], stateMutability: "view" },
  { name: "ownerOf", type: "function", inputs: [{ type: "uint256", name: "tokenId" }], outputs: [{ type: "address" }], stateMutability: "view" },
  { name: "safeTransferFrom", type: "function", inputs: [{ type: "address", name: "from" }, { type: "address", name: "to" }, { type: "uint256", name: "tokenId" }], outputs: [], stateMutability: "nonpayable" },
  { name: "transferFrom", type: "function", inputs: [{ type: "address", name: "from" }, { type: "address", name: "to" }, { type: "uint256", name: "tokenId" }], outputs: [], stateMutability: "nonpayable" },
  { name: "approve", type: "function", inputs: [{ type: "address", name: "to" }, { type: "uint256", name: "tokenId" }], outputs: [], stateMutability: "nonpayable" },
  { name: "getApproved", type: "function", inputs: [{ type: "uint256", name: "tokenId" }], outputs: [{ type: "address" }], stateMutability: "view" },
  { name: "setApprovalForAll", type: "function", inputs: [{ type: "address", name: "operator" }, { type: "bool", name: "approved" }], outputs: [], stateMutability: "nonpayable" },
  { name: "isApprovedForAll", type: "function", inputs: [{ type: "address", name: "owner" }, { type: "address", name: "operator" }], outputs: [{ type: "bool" }], stateMutability: "view" },
  { name: "supportsInterface", type: "function", inputs: [{ type: "bytes4", name: "interfaceId" }], outputs: [{ type: "bool" }], stateMutability: "view" },
  { name: "name", type: "function", inputs: [], outputs: [{ type: "string" }], stateMutability: "view" },
  { name: "symbol", type: "function", inputs: [], outputs: [{ type: "string" }], stateMutability: "view" },
  { name: "tokenURI", type: "function", inputs: [{ type: "uint256", name: "tokenId" }], outputs: [{ type: "string" }], stateMutability: "view" },
] as const;

export const royaltyAbi = [
  { name: "royaltyInfo", type: "function", inputs: [{ type: "uint256", name: "tokenId" }, { type: "uint256", name: "salePrice" }], outputs: [{ type: "address" }, { type: "uint256" }], stateMutability: "view" },
  { name: "setTokenRoyalty", type: "function", inputs: [{ type: "uint256", name: "tokenId" }, { type: "address", name: "receiver" }, { type: "uint96", name: "royaltyBasisPoints" }], outputs: [], stateMutability: "nonpayable" },
  { name: "setDefaultRoyalty", type: "function", inputs: [{ type: "address", name: "receiver" }, { type: "uint96", name: "royaltyBasisPoints" }], outputs: [], stateMutability: "nonpayable" },
] as const;
