import { useAccount } from 'wagmi';
import axios from 'axios'; // TODO: use `fetch` API
import { useQuery } from '@tanstack/react-query';

const FROM_CHAIN = 'DAI';
const FROM_TOKEN = 'USDC';
const TO_CHAIN = 'POL';
const TO_TOKEN = 'USDC';
const FROM_AMOUNT = '1000000';

const QUOTE_API_ENDPOINT = 'https://li.quest/v1/quote';

const TransferringTokensExample = () => {
  const account = useAccount();

  const {
    isLoading,
    error,
    data,
    isFetching
  } = useQuery({
    queryKey: [
      QUOTE_API_ENDPOINT,
      account.address
    ],
    queryFn: () =>
      axios
        .get(QUOTE_API_ENDPOINT, {
          params: {
            fromChain: FROM_CHAIN,
            toChain: TO_CHAIN,
            fromToken: FROM_TOKEN,
            toToken: TO_TOKEN,
            fromAmount: FROM_AMOUNT,
            fromAddress: account.address
          }
        })
        .then((res) => res.data),
      enabled: !!account.address
  });
  // ray test touch <
  console.log('ray : ***** data => ', data);
  // ray test touch >

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>{'An error has occurred: ' + (error instanceof Error ? error.message : JSON.stringify(error))}</div>;

  return (
    <div>
      <div>{isFetching ? 'Updating...' : ''}</div>
    </div>
  );
};

export default TransferringTokensExample;