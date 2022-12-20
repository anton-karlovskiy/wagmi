import * as React from 'react';
import {
  Address,
  useAccount,
  useDisconnect
} from 'wagmi';
import axios from 'axios'; // TODO: use `fetch` API

import Connect from 'src/components/Connect';
import NetworkSwitcher from 'src/components/NetworkSwitcher';

import { useIsMounted } from 'src/hooks';

const FROM_CHAIN = 'DAI';
const FROM_TOKEN = 'USDC';
const TO_CHAIN = 'POL';
const TO_TOKEN = 'USDC';
const FROM_AMOUNT = '1000000';

const getQuote = async (
  fromChain: string,
  toChain: string,
  fromToken: string,
  toToken: string,
  fromAmount: string,
  fromAddress: Address
) => {
  const result = await axios.get('https://li.quest/v1/quote', {
    params: {
      fromChain,
      toChain,
      fromToken,
      toToken,
      fromAmount,
      fromAddress
    }
  });

  return result.data;
}

const LiFi = () => {
  const isMounted = useIsMounted();

  const account = useAccount({
    onConnect: (data) => console.log('[onConnect] connected data => ', data),
    onDisconnect: () => console.log('[onDisconnect] disconnected')
  });

  const disconnect = useDisconnect();

  React.useEffect(() => {
    if (account.address === undefined) return;

    (async () => {
      const quoteData = await getQuote(
        FROM_CHAIN,
        TO_CHAIN,
        FROM_TOKEN,
        TO_TOKEN,
        FROM_AMOUNT,
        account.address as Address
      );
      // ray test touch <
      console.log('ray : ***** quoteData => ', quoteData);
      // ray test touch >
    })();
  }, [account]);

  if (!isMounted) return null;

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
    </>
  );
};

export default LiFi;