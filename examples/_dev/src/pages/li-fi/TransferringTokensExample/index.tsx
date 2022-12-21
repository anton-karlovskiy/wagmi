import * as React from 'react';
import {
  useAccount,
  Address
} from 'wagmi';
import axios from 'axios'; // TODO: use `fetch` API
import { useQuery } from '@tanstack/react-query';
import { AddressZero } from '@ethersproject/constants';
import { BigNumber } from '@ethersproject/bignumber';
import clsx from 'clsx';

import ApproveButton from './ApproveButton';
import SendButton, { CustomTransactionRequest } from './SendButton';
import {
  FROM_CHAIN,
  FROM_TOKEN,
  TO_CHAIN,
  TO_TOKEN,
  FROM_AMOUNT,
  LIFI_QUOTE_API_ENDPOINT,
  LIFI_STATUS_API_ENDPOINT
} from 'src/config/li-fi';

type Status = 'DONE' | 'FAILED';

const TransferringTokensExample = () => {
  const [sendTxHash, setSendTxHash] = React.useState<string | undefined>(undefined);

  const account = useAccount();

  const selectedAccountAddress = account.address;

  if (selectedAccountAddress === undefined) {
    throw new Error('Something went wrong!');
  }

  const {
    isLoading: quoteLoading,
    error: quoteError,
    data: quoteData,
    isFetching: quoteFetching
  } = useQuery({
    queryKey: [
      LIFI_QUOTE_API_ENDPOINT,
      selectedAccountAddress
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
            fromAddress: selectedAccountAddress
          }
        })
        .then((res) => res.data as {
          tool: string;
          transactionRequest: CustomTransactionRequest;
          action: {
            fromToken: {
              address: Address;
            };
          };
          estimate: {
            approvalAddress: Address;
          };
        }),
      enabled: !!selectedAccountAddress
  });
  console.log('[TransferringTokensExample] quoteData => ', quoteData);

  const bridge = quoteData?.tool;

  const {
    // isLoading: statusLoading,
    isFetching: statusFetching,
    error: statusError,
    data: statusData
  } = useQuery({
    queryKey: [
      LIFI_STATUS_API_ENDPOINT,
      bridge,
      sendTxHash
    ],
    queryFn: () =>
      axios
        .get(LIFI_STATUS_API_ENDPOINT, {
          params: {
            bridge,
            fromChain: FROM_CHAIN,
            toChain: TO_CHAIN,
            txHash: sendTxHash
          }
        })
        .then((res) => res.data as {
          status: Status
        }),
      enabled: !!sendTxHash && !!bridge
  });
  console.log('[TransferringTokensExample] statusData => ', statusData);

  if (quoteLoading) return <div>Loading...</div>;

  if (quoteData === undefined) {
    throw new Error('Something went wrong!');
  }
  
  const fromTokenAddress = quoteData.action.fromToken.address;
  
  const approvalAddress = quoteData.estimate.approvalAddress;
  
  const isFromTokenNativeToken = fromTokenAddress === AddressZero;

  if (quoteError) return <div>{'An error has occurred (quote): ' + (quoteError instanceof Error ? quoteError.message : JSON.stringify(quoteError))}</div>;

  if (statusError) return <div>{'An error has occurred (status): ' + (statusError instanceof Error ? statusError.message : JSON.stringify(statusError))}</div>;

  return (
    <div>
      <div
        className={clsx(
          'flex',
          'items-center',
          'space-x-2'
        )}>
        <ApproveButton
          ownerAddress={selectedAccountAddress}
          spenderAddress={approvalAddress}
          tokenAddress={fromTokenAddress}
          amount={BigNumber.from(FROM_AMOUNT)}
          disabled={isFromTokenNativeToken} />
        <SendButton
          transactionRequest={quoteData.transactionRequest}
          setSendTxHash={setSendTxHash} />
      </div>
      <div>{quoteFetching ? 'Updating...' : ''}</div>
      {statusFetching === true && <div>Waiting for the status...</div>}
    </div>
  );
};

export default TransferringTokensExample;