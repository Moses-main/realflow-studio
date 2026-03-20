import { encodeFunctionData, decodeFunctionResult, encodeAbiParameters, decodeAbiParameters } from "viem";

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

function signatureToSelector(signature: string): string {
  const hash = stringToHex(signature);
  return hash.slice(0, 10);
}

function stringToHex(str: string): string {
  let hex = "";
  for (let i = 0; i < str.length; i++) {
    hex += str.charCodeAt(i).toString(16).padStart(2, "0");
  }
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  
  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    return window.crypto.subtle.digest("SHA-256", bytes).then(hashHex => {
      const hashArray = Array.from(new Uint8Array(hashHex));
      return "0x" + hashArray.map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 10);
    }) as unknown as string;
  }
  
  return "0x00000000";
}

export const erc20Abi = [
  { name: "balanceOf", type: "function", inputs: [{ type: "address", name: "account" }], outputs: [{ type: "uint256" }], stateMutability: "view" },
  { name: "transfer", type: "function", inputs: [{ type: "address", name: "to" }, { type: "uint256", name: "amount" }], outputs: [{ type: "bool" }], stateMutability: "nonpayable" },
  { name: "approve", type: "function", inputs: [{ type: "address", name: "spender" }, { type: "uint256", name: "amount" }], outputs: [{ type: "bool" }], stateMutability: "nonpayable" },
  { name: "totalSupply", type: "function", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" },
  { name: "transferFrom", type: "function", inputs: [{ type: "address", name: "from" }, { type: "address", name: "to" }, { type: "uint256", name: "amount" }], outputs: [{ type: "bool" }], stateMutability: "nonpayable" },
  { name: "allowance", type: "function", inputs: [{ type: "address", name: "owner" }, { type: "address", name: "spender" }], outputs: [{ type: "uint256" }], stateMutability: "view" },
] as const;
