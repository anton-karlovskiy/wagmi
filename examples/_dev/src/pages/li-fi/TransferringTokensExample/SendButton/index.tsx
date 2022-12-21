import * as React from 'react';
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

type CustomTransactionRequest = TransactionRequest & { to: string; };

interface Props {
  transactionRequest: CustomTransactionRequest;
  setSendTxHash: React.Dispatch<React.SetStateAction<string | undefined>>;
}

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

  const txHash = data?.hash;

  const {
    isLoading,
    isSuccess
  } = useWaitForTransaction({
    hash: txHash
  });

  React.useEffect(() => {
    if (setSendTxHash === undefined) return;
    
    setSendTxHash(txHash);
  }, [
    txHash,
    setSendTxHash
  ]);

  const handleSend = () => {
    if (sendTransaction === undefined) {
      throw new Error('Something went wrong!');
    }

    sendTransaction();
  };

  return (
    <div>
      <Button
        className='w-full'
        disabled={
          isLoading ||
          !sendTransaction
        }
        onClick={handleSend}>
        {isLoading ? 'Sending...' : 'Send'}
      </Button>
      {isSuccess && (
        <div>
          <p>
            Successfully sent {FROM_AMOUNT} {FROM_TOKEN} from {FROM_CHAIN} to {TO_CHAIN}!
          </p>
          <div>
            <a
              target='_blank'
              rel='noopener noreferrer'
              href={`${BLOCK_EXPLORER_TX_HASH_URL}/${txHash}`}>
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
