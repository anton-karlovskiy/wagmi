import {
  useAccount,
  // ray test touch <
  useSendTransaction,
  useWaitForTransaction,
  // ray test touch >
  usePrepareSendTransaction
} from 'wagmi';
import axios from 'axios'; // TODO: use `fetch` API
import { useQuery } from '@tanstack/react-query';
import { TransactionRequest } from '@ethersproject/providers';

const FROM_CHAIN = 'ETH';
const FROM_TOKEN = 'USDC';
const TO_CHAIN = 'AVA';
const TO_TOKEN = 'USDC';
const FROM_AMOUNT = '10000'; 0.01 USDC

const LIFI_QUOTE_API_ENDPOINT = 'https://li.quest/v1/quote';

const BLOCK_EXPLORER_TX_HASH_URL = 'https://blockscout.com/xdai/mainnet/tx';

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
          transactionRequest: TransactionRequest & { to: string; }
        }),
      enabled: !!account.address
  });
  // ray test touch <
  console.log('ray : ***** quoteData => ', quoteData);
  // ray test touch >

  const { config } = usePrepareSendTransaction({
    request: quoteData?.transactionRequest
  });
  // ray test touch <
  console.log('ray : ***** config => ', config);
  // ray test touch >

  // ray test touch <
  const {
    data,
    sendTransaction
  } = useSendTransaction(config);

  const {
    isLoading,
    isSuccess
  } = useWaitForTransaction({
    hash: data?.hash
  })
  // ray test touch >

  if (quoteLoading) return <div>Loading...</div>;

  if (quoteError) return <div>{'An error has occurred: ' + (quoteError instanceof Error ? quoteError.message : JSON.stringify(quoteError))}</div>;

  return (
    <div>
      <div>{quoteFetching ? 'Updating...' : ''}</div>
      {/* ray test touch < */}
      <button
        disabled={isLoading || !sendTransaction}
        onClick={() => {
          sendTransaction?.();
        }}>
        {isLoading ? 'Sending...' : 'Send'}
      </button>
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
      {/* ray test touch > */}
    </div>
  );
};

export default TransferringTokensExample;