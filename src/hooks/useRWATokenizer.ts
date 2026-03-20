import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { parseEther } from "viem";
import { RWATOKENIZER_ABI } from "./abis";

const RWATOKENIZER_ADDRESS = "0xc9497Ec40951FbB98C02c666b7F9Fa143678E2Be" as const;

export interface RWAToken {
  id: bigint;
  uri: string;
  totalSupply: bigint;
}

export function useRWATokenizer() {
  const { data: totalSupply, isLoading: isLoadingTotalSupply } = useContractRead({
    address: RWATOKENIZER_ADDRESS,
    abi: RWATOKENIZER_ABI,
    functionName: "totalSupply",
    watch: true,
  });

  const { data: owner, isLoading: isLoadingOwner } = useContractRead({
    address: RWATOKENIZER_ADDRESS,
    abi: RWATOKENIZER_ABI,
    functionName: "owner",
  });

  return {
    contractAddress: RWATOKENIZER_ADDRESS,
    totalSupply: totalSupply ?? BigInt(0),
    owner,
    isLoadingTotalSupply,
    isLoadingOwner,
    explorerUrl: `https://amoy.polygonscan.com/address/${RWATOKENIZER_ADDRESS}`,
  };
}

export function useMintRWA(to: `0x${string}`, tokenId: bigint, amount: bigint, metadataURI: string) {
  const { config, error: prepareError, isError: isPrepareError } = usePrepareContractWrite({
    address: RWATOKENIZER_ADDRESS,
    abi: RWATOKENIZER_ABI,
    functionName: "mintRWA",
    args: [to, tokenId, amount, metadataURI],
  });

  const { data, write, isLoading: isWriteLoading, isError: isWriteError } = useContractWrite(config);

  const { isLoading: isTxLoading, isSuccess, error: txError } = useWaitForTransaction({
    hash: data?.hash,
  });

  return {
    mint: write,
    isLoading: isWriteLoading || isTxLoading,
    isSuccess,
    isPrepareError,
    isWriteError,
    txError,
    hash: data?.hash,
  };
}

export function useTokenURI(tokenId: bigint) {
  const { data, isLoading, isError } = useContractRead({
    address: RWATOKENIZER_ADDRESS,
    abi: RWATOKENIZER_ABI,
    functionName: "uri",
    args: [tokenId],
  });

  return {
    uri: data as string | undefined,
    isLoading,
    isError,
  };
}

export function useBalanceOf(account: `0x${string}`, tokenId: bigint) {
  const { data, isLoading, isError } = useContractRead({
    address: RWATOKENIZER_ADDRESS,
    abi: RWATOKENIZER_ABI,
    functionName: "balanceOf",
    args: [account, tokenId],
  });

  return {
    balance: data ?? BigInt(0),
    isLoading,
    isError,
  };
}
