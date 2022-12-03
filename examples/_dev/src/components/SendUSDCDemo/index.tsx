import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  erc20ABI
} from 'wagmi';
import { parseUnits } from '@ethersproject/units';

const USDC_CONTRACT_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
const RECIPIENT_ADDRESS = '0x4336Eb76E1ADa43b02d933Ac40499C584f1D60c9';
const USDC_AMOUNT = '0.01';
const USDC_DECIMALS = 6;

// MEMO: inspired by https://wagmi.sh/examples/contract-write
const SendUSDCDemo = () => {
  const {
    config,
    error: prepareError,
    isError: isPrepareError
  } = usePrepareContractWrite({
    address: USDC_CONTRACT_ADDRESS,
    abi: erc20ABI,
    functionName: 'transfer',
    args: [
      RECIPIENT_ADDRESS,
      parseUnits(USDC_AMOUNT, USDC_DECIMALS)
    ]
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