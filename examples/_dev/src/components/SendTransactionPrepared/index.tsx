import {
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction
} from 'wagmi';
import { parseEther } from '@ethersproject/units';

const SendTransactionPrepared = () => {
  const { config } = usePrepareSendTransaction({
    request: {
      to: '0xb29c23a84f84625Ae7ec7A5239386d400c67Dcb4',
      value: parseEther('0.0001')
    }
  });

  const {
    data,
    // isIdle,
    // isLoading,
    // isSuccess,
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
        {isLoading ? 'Sending...' : 'Send'}
      </button>
      {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
      {isError && <div>Error sending transaction</div>}
    </div>
  )
}

export default SendTransactionPrepared;