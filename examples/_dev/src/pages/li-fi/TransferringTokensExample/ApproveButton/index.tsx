// ray test touch <
import {
  useContractRead, 
  Address
} from 'wagmi';
import { erc20ABI } from '@wagmi/core';
import { BigNumber } from '@ethersproject/bignumber';

import Button, { Props as ButtonProps } from 'src/components/Button';

interface Props extends ButtonProps {
  ownerAddress: Address;
  spenderAddress: Address;
  tokenAddress: Address;
  amount: BigNumber;
}

const ApproveButton = ({
  ownerAddress,
  spenderAddress,
  tokenAddress,
  amount,
  ...rest
}: Props) => {
  const {
    error: allowanceError,
    isLoading: allowanceLoading,
    data: allowanceData // TODO: revalidate once approved
  } = useContractRead({
    address: tokenAddress,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [
      ownerAddress,
      spenderAddress
    ],
  });

  if (allowanceLoading) return <div>Loading...</div>;

  if (allowanceData === undefined) {
    throw new Error('Something went wrong!');
  }

  if (allowanceError) return <div>{'An error has occurred (allowance): ' + (allowanceError instanceof Error ? allowanceError.message : JSON.stringify(allowanceError))}</div>;

  // ray test touch <
  console.log('ray : ***** allowanceData.toString() => ', allowanceData.toString());
  // ray test touch >

  const approvalRequired = allowanceData.lt(amount);

  return (
    <Button
      disabled={!approvalRequired}
      {...rest}>
      Approve
    </Button>
  );
};

export default ApproveButton;
// ray test touch >
