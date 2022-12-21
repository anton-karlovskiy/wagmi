import {
  useAccount,
  useSendTransaction,
  useWaitForTransaction,
  usePrepareSendTransaction,
  useContractRead, 
  Address
} from 'wagmi';
import { erc20ABI } from '@wagmi/core';
import axios from 'axios'; // TODO: use `fetch` API
import { useQuery } from '@tanstack/react-query';
import { TransactionRequest } from '@ethersproject/providers';
// ray test touch <
import { AddressZero } from '@ethersproject/constants';
import { BigNumber } from '@ethersproject/bignumber';
// ray test touch >
import clsx from 'clsx';

import Button from 'src/components/Button';

const FROM_CHAIN = 'AVA';
const FROM_TOKEN = 'USDC';
const TO_CHAIN = 'ETH';
const TO_TOKEN = 'USDC';
const FROM_AMOUNT = '10000'; // 0.01 USDC

const LIFI_QUOTE_API_ENDPOINT = 'https://li.quest/v1/quote';

const LIFI_STATUS_API_ENDPOINT = 'https://li.quest/v1/status';

// const BLOCK_EXPLORER_TX_HASH_URL = 'https://blockscout.com/xdai/mainnet/tx';
// const BLOCK_EXPLORER_TX_HASH_URL = 'https://etherscan.io/tx';
const BLOCK_EXPLORER_TX_HASH_URL = 'https://snowtrace.io/tx';

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
          action: {
            fromToken: {
              address: Address;
            };
          };
          estimate: {
            approvalAddress: Address;
          };
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

  // ray test touch <
  const fromTokenAddress = quoteData?.action.fromToken.address;

  const isFromTokenNativeToken = fromTokenAddress === AddressZero;
  // ray test touch >

  const {
    error: allowanceError,
    isLoading: allowanceLoading,
    data: allowanceData // TODO: revalidate once approved
  } = useContractRead({
    address:
      (account.address && quoteData?.estimate.approvalAddress) ?
        fromTokenAddress :
        undefined,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [
      account.address as Address,
      quoteData?.estimate.approvalAddress as Address
    ],
  });

  if (
    quoteLoading ||
    allowanceLoading
  ) return <div>Loading...</div>;

  if (allowanceData === undefined) {
    throw new Error('Something went wrong!');
  }

  if (quoteError) return <div>{'An error has occurred (quote): ' + (quoteError instanceof Error ? quoteError.message : JSON.stringify(quoteError))}</div>;

  if (statusError) return <div>{'An error has occurred (status): ' + (statusError instanceof Error ? statusError.message : JSON.stringify(statusError))}</div>;

  if (allowanceError) return <div>{'An error has occurred (allowance): ' + (allowanceError instanceof Error ? allowanceError.message : JSON.stringify(allowanceError))}</div>;

  // ray test touch <
  console.log('ray : ***** allowanceData.toString() => ', allowanceData.toString());
  const approvalRequired = allowanceData.lt(BigNumber.from(FROM_AMOUNT));
  // ray test touch >

  return (
    <div>
      <div
        className={clsx(
          'flex',
          'items-center',
          'space-x-2'
        )}>
        {/* ray test touch < */}
        <Button
          disabled={
            isFromTokenNativeToken ||
            !approvalRequired
          }>
          Approve
        </Button>
        {/* ray test touch > */}
        <Button
          disabled={
            isLoading ||
            !sendTransaction ||
            // ray test touch <
            approvalRequired
            // ray test touch >
          }
          onClick={() => {
            sendTransaction?.();
          }}>
          {isLoading ? 'Sending...' : 'Send'}
        </Button>
      </div>
      <div>{quoteFetching ? 'Updating...' : ''}</div>
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