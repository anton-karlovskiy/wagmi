import * as React from 'react';
import {
  useContractRead, 
  Address,
  // ray test touch <
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction
  // ray test touch >
} from 'wagmi';
import { erc20ABI } from '@wagmi/core';
import { BigNumber } from '@ethersproject/bignumber';
// ray test touch <
import { MaxUint256 } from '@ethersproject/constants';
// ray test touch >

import Button, { Props as ButtonProps } from 'src/components/Button';
import { BLOCK_EXPLORER_TX_HASH_URL } from 'src/config/li-fi';

interface Props extends ButtonProps {
  ownerAddress: Address;
  spenderAddress: Address;
  tokenAddress: Address;
  amount: BigNumber;
  // ray test touch <
  setApprovalRequired: React.Dispatch<React.SetStateAction<boolean>>;
  // ray test touch >
}

const ApproveButton = ({
  ownerAddress,
  spenderAddress,
  tokenAddress,
  amount,
  // ray test touch <
  setApprovalRequired,
  // ray test touch >
  ...rest
}: Props) => {
  const {
    error: allowanceError,
    isLoading: allowanceLoading,
    data: allowanceData,
    // ray test touch <
    refetch: allowanceRefetch
    // ray test touch >
  } = useContractRead({
    address: tokenAddress,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [
      ownerAddress,
      spenderAddress
    ],
  });

  // ray test touch <
  const { config } = usePrepareContractWrite({
    address: tokenAddress,
    abi: erc20ABI,
    functionName: 'approve',
    args: [
      spenderAddress,
      MaxUint256
    ]
  });

  const {
    data,
    write,
  } = useContractWrite({
    ...config,
    // ray test touch <
    onSuccess(data) {
      console.log('[ApproveButton useContractWrite onSuccess] data =>', data);
      allowanceRefetch();
    }
    // ray test touch >
  });

  const txHash = data?.hash;

  const {
    isLoading,
    isSuccess
  } = useWaitForTransaction({
    hash: txHash
  });

  React.useEffect(() => {
    if (setApprovalRequired === undefined) return;
    
    setApprovalRequired(Boolean(allowanceData?.lt(amount)));
  }, [
    txHash,
    setApprovalRequired,
    allowanceData,
    amount
  ]);

  const handleApprove = () => {
    if (write === undefined) {
      throw new Error('Something went wrong!');
    }

    write();
  };
  // ray test touch >

  if (allowanceLoading) return <div>Loading...</div>;

  if (allowanceData === undefined) {
    throw new Error('Something went wrong!');
  }

  if (allowanceError) return <div>{'An error has occurred (allowance): ' + (allowanceError instanceof Error ? allowanceError.message : JSON.stringify(allowanceError))}</div>;

  // ray test touch <
  console.log('ray : ***** allowanceData.toString() => ', allowanceData.toString());
  // ray test touch >

  return (
    <Button
      disabled={
        // ray test touch <
        !write ||
        isLoading
        // ray test touch >
      }
      // ray test touch <
      onClick={handleApprove}
      // ray test touch >
      {...rest}>
      {isLoading ? 'Approving...' : 'Approve'}
      {/* ray test touch < */}
      {isSuccess && (
        <div>
          <p>
            Successfully approved!
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
      {/* ray test touch > */}
    </Button>
  );
};

export default ApproveButton;
