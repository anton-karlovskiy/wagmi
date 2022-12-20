import {
  useAccount,
  useDisconnect
} from 'wagmi';
import axios from 'axios'; // TODO: use `fetch` API
import { useQuery } from '@tanstack/react-query';

import Connect from 'src/components/Connect';
import NetworkSwitcher from 'src/components/NetworkSwitcher';
import { useIsMounted } from 'src/hooks';

const FROM_CHAIN = 'DAI';
const FROM_TOKEN = 'USDC';
const TO_CHAIN = 'POL';
const TO_TOKEN = 'USDC';
const FROM_AMOUNT = '1000000';

const QUOTE_API_ENDPOINT = 'https://li.quest/v1/quote';

const LiFi = () => {
  const isMounted = useIsMounted();

  const account = useAccount({
    onConnect: (data) => console.log('[onConnect] connected data => ', data),
    onDisconnect: () => console.log('[onDisconnect] disconnected')
  });

  const disconnect = useDisconnect();

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

  if (!isMounted) return null;

  if (isLoading) return <div>Loading...</div>;

  if (error) return 'An error has occurred: ' + (error instanceof Error ? error.message : String(error));

  return (
    <>
      <Connect />
      <NetworkSwitcher />
      <div>
        {isMounted && account.connector && (
          <div>Connected to {account.connector.name}</div>
        )}
        {account.address && (
          <div>
            <button onClick={() => disconnect.disconnect()}>Disconnect</button>
          </div>
        )}
      </div>
      <div>{isFetching ? 'Updating...' : ''}</div>
    </>
  );
};

export default LiFi;