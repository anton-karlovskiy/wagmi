import {
  useAccount,
  // ray test touch <
  useSendTransaction,
  // ray test touch >
  usePrepareSendTransaction
} from 'wagmi';
import axios from 'axios'; // TODO: use `fetch` API
import { useQuery } from '@tanstack/react-query';
import { TransactionRequest } from '@ethersproject/providers';

const FROM_CHAIN = 'DAI';
const FROM_TOKEN = 'USDC';
const TO_CHAIN = 'POL';
const TO_TOKEN = 'USDC';
const FROM_AMOUNT = '1000000';

const LIFI_QUOTE_API_ENDPOINT = 'https://li.quest/v1/quote';

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

  if (quoteLoading) return <div>Loading...</div>;

  if (quoteError) return <div>{'An error has occurred: ' + (quoteError instanceof Error ? quoteError.message : JSON.stringify(quoteError))}</div>;

  return (
    <div>
      <div>{quoteFetching ? 'Updating...' : ''}</div>
    </div>
  );
};

export default TransferringTokensExample;