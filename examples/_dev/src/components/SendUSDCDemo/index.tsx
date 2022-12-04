import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useNetwork,
  chain,
  erc20ABI
} from 'wagmi';
import { parseUnits } from '@ethersproject/units';

import { avalanche } from '../../config/chains';

const ETHEREUM_USDC_CONTRACT_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
const AVALANCHE_USDC_CONTRACT_ADDRESS = '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E'
const RECIPIENT_ADDRESS = '0x0E63934079EDA886822CA589e0e533ea7440948E';
const USDC_AMOUNT = '0.01';
const USDC_DECIMALS = 6;

// MEMO: inspired by https://wagmi.sh/examples/contract-write
const SendUSDCDemo = () => {
  const { chain: selectedChain } = useNetwork();

  let usdcContractAddress;
  if (selectedChain?.id === chain.mainnet.id) {
    usdcContractAddress = ETHEREUM_USDC_CONTRACT_ADDRESS;
  } else if (selectedChain?.id === avalanche.id) {
    usdcContractAddress = AVALANCHE_USDC_CONTRACT_ADDRESS;
  } else {
    usdcContractAddress = undefined;
  }

  const {
    config,
    error: prepareError,
    isError: isPrepareError
  } = usePrepareContractWrite({
    address: usdcContractAddress,
    abi: erc20ABI,
    functionName: 'transfer',
    args: [
      RECIPIENT_ADDRESS,
      parseUnits(USDC_AMOUNT, USDC_DECIMALS)
    ],
    enabled: !!usdcContractAddress
  });

  const {
    data,
    error,
    isError,
    write
  } = useContractWrite(config);

  const {
    isLoading,
    isSuccess
  } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <div>
      <button
        disabled={isLoading || !write}
        onClick={() => write?.()}>
        {isLoading ? 'Sending USDC...' : 'Send USDC'}
      </button>
      {(isPrepareError || isError) && (
        <div>Error: {(prepareError || error)?.message}</div>
      )}
      {isSuccess && <div>Transaction hash: {data?.hash}</div>}
    </div>
  );
};

export default SendUSDCDemo;