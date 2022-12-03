import {
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction
} from 'wagmi';
import { parseEther } from '@ethersproject/units';

// ray test touch <
const RECIPIENT_ADDRESS = '0xb29c23a84f84625Ae7ec7A5239386d400c67Dcb4';
const NATIVE_TOKEN_AMOUNT = '0.0001';
// ray test touch >

// MEMO: inspired by https://wagmi.sh/examples/send-transaction
const SendNativeTokenDemo = () => {
  const {
    config,
    // ray test touch <
    error: prepareError,
    isError: isPrepareError
    // ray test touch >
  } = usePrepareSendTransaction({
    request: {
      to: RECIPIENT_ADDRESS,
      value: parseEther(NATIVE_TOKEN_AMOUNT)
    }
  });

  const {
    data,
    // ray test touch <
    error,
    // ray test touch >
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
      {/* ray test touch < */}
      {(isPrepareError || isError) && (
        <div>Error: {(prepareError || error)?.message}</div>
      )}
      {isSuccess && <div>Transaction hash: {data?.hash}</div>}
      {/* ray test touch > */}
    </div>
  )
}

export default SendNativeTokenDemo;