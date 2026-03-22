import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { MARKETPLACE_FACTORY_ABI } from "./abis";

const MARKETPLACE_FACTORY_ADDRESS = (import.meta.env.VITE_MARKETPLACE_FACTORY_ADDRESS || "0x802A6843516f52144b3F1D04E5447A085d34aF37") as `0x${string}`;

export function useMarketplaceFactory() {
  const { data: owner, isLoading: isLoadingOwner } = useContractRead({
    address: MARKETPLACE_FACTORY_ADDRESS,
    abi: MARKETPLACE_FACTORY_ABI,
    functionName: "owner",
  });

  const { data: tokenImplementation, isLoading: isLoadingImplementation } = useContractRead({
    address: MARKETPLACE_FACTORY_ADDRESS,
    abi: MARKETPLACE_FACTORY_ABI,
    functionName: "tokenImplementation",
  });

  return {
    contractAddress: MARKETPLACE_FACTORY_ADDRESS,
    owner,
    tokenImplementation,
    isLoadingOwner,
    isLoadingImplementation,
    explorerUrl: `https://amoy.polygonscan.com/address/${MARKETPLACE_FACTORY_ADDRESS}`,
  };
}

export function useCreateMarketplace(name: string) {
  const { config, error: prepareError, isError: isPrepareError } = usePrepareContractWrite({
    address: MARKETPLACE_FACTORY_ADDRESS,
    abi: MARKETPLACE_FACTORY_ABI,
    functionName: "createMarketplace",
    args: [name],
  });

  const { data, write, isLoading: isWriteLoading, isError: isWriteError } = useContractWrite(config);

  const { isLoading: isTxLoading, isSuccess, error: txError } = useWaitForTransaction({
    hash: data?.hash,
  });

  return {
    create: write,
    isLoading: isWriteLoading || isTxLoading,
    isSuccess,
    isPrepareError,
    isWriteError,
    txError,
    hash: data?.hash,
  };
}
