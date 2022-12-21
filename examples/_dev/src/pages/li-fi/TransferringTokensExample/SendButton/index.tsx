// ray test touch <
import * as React from 'react';
// ray test touch >
import {
  useSendTransaction,
  useWaitForTransaction,
  usePrepareSendTransaction,
} from 'wagmi';
import { TransactionRequest } from '@ethersproject/providers';

import Button from 'src/components/Button';
import {
  FROM_CHAIN,
  FROM_TOKEN,
  TO_CHAIN,
  FROM_AMOUNT,
  BLOCK_EXPLORER_TX_HASH_URL
} from 'src/config/li-fi';

// ray test touch <
type CustomTransactionRequest = TransactionRequest & { to: string; };

interface Props {
  transactionRequest: CustomTransactionRequest;
  setSendTxHash: React.Dispatch<React.SetStateAction<string | undefined>>;
}
// ray test touch >

const SendButton = ({
  transactionRequest,
  setSendTxHash
}: Props) => {
  const { config } = usePrepareSendTransaction({
    request: transactionRequest
  });
  console.log('[TransferringTokensExample] config => ', config);

  const {
    data,
    sendTransaction
  } = useSendTransaction(config);

  // ray test touch <
  const txHash = data?.hash;
  // ray test touch >

  const {
    isLoading,
    isSuccess
  } = useWaitForTransaction({
    hash: txHash
  });

  // ray test touch <
  React.useEffect(() => {
    if (txHash === undefined) return;
    if (setSendTxHash === undefined) return;
    
    setSendTxHash(txHash);
  }, [
    txHash,
    setSendTxHash
  ]);
  // ray test touch >

  // ray test touch <
  const handleSendTransaction = () => {
    if (sendTransaction === undefined) {
      throw new Error('Something went wrong!');
    }

    sendTransaction();
  };
  // ray test touch >

  return (
    <div>
      <Button
        disabled={
          isLoading ||
          !sendTransaction
        }
        onClick={handleSendTransaction}>
        {isLoading ? 'Sending...' : 'Send'}
      </Button>
      {isSuccess && (
        <div>
          <p>
            Successfully sent {FROM_AMOUNT} {FROM_TOKEN} from {FROM_CHAIN} to {TO_CHAIN}.
          </p>
          <div>
            <a
              target='_blank'
              rel='noopener noreferrer'
              href={`${BLOCK_EXPLORER_TX_HASH_URL}/${data?.hash}`}>
              Block Explorer
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export type { CustomTransactionRequest };

export default SendButton;
