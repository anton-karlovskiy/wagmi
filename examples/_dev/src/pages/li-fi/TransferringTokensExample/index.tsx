import {
  useAccount,
  useSendTransaction,
  useWaitForTransaction,
  usePrepareSendTransaction
} from 'wagmi';
import axios from 'axios'; // TODO: use `fetch` API
import { useQuery } from '@tanstack/react-query';
import { TransactionRequest } from '@ethersproject/providers';

const FROM_CHAIN = 'ETH';
const FROM_TOKEN = 'USDC';
const TO_CHAIN = 'AVA';
const TO_TOKEN = 'USDC';
const FROM_AMOUNT = '10000'; // 0.01 USDC

const LIFI_QUOTE_API_ENDPOINT = 'https://li.quest/v1/quote';

const LIFI_STATUS_API_ENDPOINT = 'https://li.quest/v1/status';

// const BLOCK_EXPLORER_TX_HASH_URL = 'https://blockscout.com/xdai/mainnet/tx';
const BLOCK_EXPLORER_TX_HASH_URL = 'https://etherscan.io/tx';

const TransferringTokensExample = () => {
  const account = useAccount();

  const {
    isLoading: quoteLoading,
    error: quoteError,
    data: quoteData,
    isFetching: quoteFetching
  } = useQuery({
    queryKey: [
      LIFI_QUOTE_API_ENDPOINT,
      account.address
    ],
    queryFn: () =>
      axios
        .get(LIFI_QUOTE_API_ENDPOINT, {
          params: {
            fromChain: FROM_CHAIN,
            toChain: TO_CHAIN,
            fromToken: FROM_TOKEN,
            toToken: TO_TOKEN,
            fromAmount: FROM_AMOUNT,
            fromAddress: account.address
          }
        })
        .then((res) => res.data as {
          tool: string;
          transactionRequest: TransactionRequest & { to: string; };
        }),
      enabled: !!account.address
  });

  console.log('[TransferringTokensExample] quoteData => ', quoteData);

  const { config } = usePrepareSendTransaction({
    request: quoteData?.transactionRequest
  });

  console.log('[TransferringTokensExample] config => ', config);

  const {
    data,
    sendTransaction
  } = useSendTransaction(config);

  const {
    isLoading,
    isSuccess
  } = useWaitForTransaction({
    hash: data?.hash
  });

  const {
    // isLoading: statusLoading,
    isFetching: statusFetching,
    error: statusError,
    data: statusData
  } = useQuery({
    queryKey: [
      LIFI_STATUS_API_ENDPOINT,
      quoteData?.tool,
      data?.hash
    ],
    queryFn: () =>
      axios
        .get(LIFI_STATUS_API_ENDPOINT, {
          params: {
            bridge: quoteData?.tool,
            fromChain: FROM_CHAIN,
            toChain: TO_CHAIN,
            txHash: data?.hash
          }
        })
        .then((res) => res.data as {
          status: 'DONE' | 'FAILED'
        }),
      enabled: !!(data?.hash) && !!(quoteData?.tool)
  });

  console.log('[TransferringTokensExample] statusData => ', statusData);

  if (quoteLoading) return <div>Loading...</div>;

  if (quoteError) return <div>{'An error has occurred (quote): ' + (quoteError instanceof Error ? quoteError.message : JSON.stringify(quoteError))}</div>;

  if (statusError) return <div>{'An error has occurred (status): ' + (statusError instanceof Error ? statusError.message : JSON.stringify(statusError))}</div>;

  return (
    <div>
      <div>{quoteFetching ? 'Updating...' : ''}</div>
      <button
        disabled={isLoading || !sendTransaction}
        onClick={() => {
          sendTransaction?.();
        }}>
        {isLoading ? 'Sending...' : 'Send'}
      </button>
      {statusFetching === true && <div>Waiting for the status...</div>}
      {isSuccess && (
        <div>
          Successfully sent {FROM_AMOUNT} {FROM_TOKEN} from {FROM_CHAIN} to {TO_CHAIN}.
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

export default TransferringTokensExample;