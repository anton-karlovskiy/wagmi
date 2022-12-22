import * as React from 'react';
import {
  useContractRead, 
  Address,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction
} from 'wagmi';
import { erc20ABI } from '@wagmi/core';
import { BigNumber } from '@ethersproject/bignumber';
import { MaxUint256 } from '@ethersproject/constants';

import Button, { Props as ButtonProps } from 'src/components/Button';
import { BLOCK_EXPLORER_TX_HASH_URL } from 'src/config/li-fi';

interface Props extends ButtonProps {
  ownerAddress: Address;
  spenderAddress: Address;
  tokenAddress: Address;
  amount: BigNumber;
  setApprovalRequired: React.Dispatch<React.SetStateAction<boolean>>;
}

const ApproveButton = ({
  ownerAddress,
  spenderAddress,
  tokenAddress,
  amount,
  setApprovalRequired,
  ...rest
}: Props) => {
  const {
    error: allowanceError,
    isLoading: allowanceLoading,
    data: allowanceData,
    refetch: allowanceRefetch
  } = useContractRead({
    address: tokenAddress,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [
      ownerAddress,
      spenderAddress
    ],
  });

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
    onSuccess(data) {
      console.log('[ApproveButton useContractWrite onSuccess] data =>', data);
      allowanceRefetch();
    }
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

  if (allowanceLoading) return <div>Loading...</div>;

  if (allowanceData === undefined) {
    throw new Error('Something went wrong!');
  }

  if (allowanceError) return <div>{'An error has occurred (allowance): ' + (allowanceError instanceof Error ? allowanceError.message : JSON.stringify(allowanceError))}</div>;

  // ray test touch <
  console.log('ray : ***** allowanceData.toString() => ', allowanceData.toString());
  // ray test touch >

  return (
    <div>
      <Button
        disabled={
          !write ||
          isLoading
        }
        onClick={handleApprove}
        {...rest}>
        {isLoading ? 'Approving...' : 'Approve'}
      </Button>
      {isSuccess && (
        <div>
          <p>
            Successfully approved!
          </p>
          <a
            target='_blank'
            rel='noopener noreferrer'
            href={`${BLOCK_EXPLORER_TX_HASH_URL}/${txHash}`}>
            View on block explorer
          </a>
        </div>
      )}
    </div>
  );
};

export default ApproveButton;
