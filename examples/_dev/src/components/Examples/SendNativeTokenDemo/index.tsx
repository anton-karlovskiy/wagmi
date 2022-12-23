import {
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction
} from 'wagmi';
import { parseEther } from '@ethersproject/units';

const RECIPIENT_ADDRESS = '0x0E63934079EDA886822CA589e0e533ea7440948E';
const NATIVE_TOKEN_AMOUNT = '0.0001';

// MEMO: inspired by https://wagmi.sh/examples/send-transaction
const SendNativeTokenDemo = () => {
  const {
    config,
    error: prepareError,
    isError: isPrepareError
  } = usePrepareSendTransaction({
    request: {
      to: RECIPIENT_ADDRESS,
      value: parseEther(NATIVE_TOKEN_AMOUNT)
    }
  });

  const {
    data,
    error,
    isError,
    sendTransaction
  } = useSendTransaction(config);

  const {
    isLoading,
    isSuccess
  } = useWaitForTransaction({
    hash: data?.hash
  });

  return (
    <div>
      <button
        disabled={isLoading || !sendTransaction}
        onClick={() => sendTransaction?.()}>
        {isLoading ? 'Sending ETH...' : 'Send ETH'}
      </button>
      {(isPrepareError || isError) && (
        <div>Error: {(prepareError || error)?.message}</div>
      )}
      {isSuccess && <div>Transaction hash: {data?.hash}</div>}
    </div>
  )
}

export default SendNativeTokenDemo;