import * as React from 'react';
import {
  useAccount,
  Address,
  useNetwork
} from 'wagmi';
import axios from 'axios'; // TODO: use `fetch` API
import { useQuery } from '@tanstack/react-query';
import { AddressZero } from '@ethersproject/constants';
import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';
import clsx from 'clsx';

import ApproveButton from './ApproveButton';
import SendButton, { CustomTransactionRequest } from './SendButton';
import {
  FROM_CHAIN,
  FROM_TOKEN,
  TO_CHAIN,
  TO_TOKEN,
  FROM_AMOUNT,
  BLOCK_EXPLORER_TX_HASH_URL,
  LIFI_QUOTE_API_ENDPOINT,
  LIFI_STATUS_API_ENDPOINT
} from 'src/config/li-fi';

type Status = 'DONE' | 'FAILED' | 'NOT_FOUND';

const TransferringTokensExample = () => {
  const [sendTxHash, setSendTxHash] = React.useState<string | undefined>(undefined);

  const [approvalRequired, setApprovalRequired] = React.useState<boolean>(true);

  const [statusRefetchInterval, setStatusRefetchInterval] = React.useState(1000);

  const account = useAccount();

  const { chain: selectedChain } = useNetwork();

  const selectedAccountAddress = account.address;

  // Initialize the approve status of the from token
  React.useEffect(() => {
    if (!selectedAccountAddress) return;
    if (!selectedChain) return;

    setApprovalRequired(true);
  }, [
    selectedAccountAddress,
    selectedChain
  ]);

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
              decimals: number;
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
    enabled: !!sendTxHash && !!bridge,
    refetchInterval: statusRefetchInterval
  });
  console.log('[TransferringTokensExample] statusData => ', statusData);

  React.useEffect(() => {
    if (!statusData) return;

    if (statusData.status === 'DONE' || statusData.status === 'FAILED') {
      setStatusRefetchInterval(0);
    }
  }, [statusData]);

  if (quoteLoading) return <div>Loading...</div>;

  if (quoteError) return <div>{'An error has occurred (quote): ' + (quoteError instanceof Error ? quoteError.message : JSON.stringify(quoteError))}</div>;

  if (statusError) return <div>{'An error has occurred (status): ' + (statusError instanceof Error ? statusError.message : JSON.stringify(statusError))}</div>;

  if (quoteData === undefined) {
    throw new Error('Something went wrong!');
  }
  
  const fromTokenAddress = quoteData.action.fromToken.address;
  
  const approvalAddress = quoteData.estimate.approvalAddress;

  const fromTokenDecimals = quoteData.action.fromToken.decimals;

  const displayFromAmount = formatUnits(FROM_AMOUNT, fromTokenDecimals);
  
  const isFromTokenNativeToken = fromTokenAddress === AddressZero;

  return (
    <div className='space-y-3'>
      <div
        className={clsx(
          'flex',
          'items-center',
          'space-x-2'
        )}>
        <div className='flex-1'>
          {approvalRequired ? (
            <ApproveButton
              ownerAddress={selectedAccountAddress}
              spenderAddress={approvalAddress}
              tokenAddress={fromTokenAddress}
              amount={BigNumber.from(FROM_AMOUNT)}
              disabled={isFromTokenNativeToken}
              setApprovalRequired={setApprovalRequired} />
          ) : (
            <SendButton
              transactionRequest={quoteData.transactionRequest}
              setSendTxHash={setSendTxHash} />
          )}
        </div>
        <div className='flex-1'>
          <p>
            Transferring {FROM_AMOUNT} From {FROM_TOKEN} on {FROM_CHAIN} To {TO_TOKEN} on {TO_CHAIN}.
          </p>
          <p>
            Please make sure that your wallet is connected to {FROM_CHAIN} during the process.
          </p>
        </div>
      </div>
      {(statusData?.status === 'DONE' || statusData?.status === 'FAILED') && (
        <div>
          {statusData?.status === 'DONE' && (
            <p>
              Successfully transferred {displayFromAmount} {FROM_TOKEN} from {FROM_CHAIN} to {TO_CHAIN}!
            </p>
          )}
          {statusData?.status === 'FAILED' && (
            <p>
              Failed to transfer {displayFromAmount} {FROM_TOKEN} from {FROM_CHAIN} to {TO_CHAIN}!
            </p>
          )}
          <a
            className={clsx(
              'underline',
              'inline-block'
            )}
            target='_blank'
            rel='noopener noreferrer'
            href={`${BLOCK_EXPLORER_TX_HASH_URL}/${sendTxHash}`}>
            View on block explorer
          </a>
        </div>
      )}
      {statusFetching === true && <p>Waiting for the status data...</p>}
      {quoteFetching === true && <p>Waiting for the quote data...</p>}
    </div>
  );
};

export default TransferringTokensExample;