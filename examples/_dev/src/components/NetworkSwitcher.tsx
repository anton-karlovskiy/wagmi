import {
  useNetwork,
  useSwitchNetwork
} from 'wagmi';

import Button from 'src/components/Button';

const NetworkSwitcher = () => {
  const { chain } = useNetwork();
  const {
    chains,
    error,
    pendingChainId,
    switchNetwork,
    status
  } = useSwitchNetwork();

  return (
    <div>
      {chain && <div>Using {chain.name}</div>}
      <div className='space-x-2'>
        {chains.map((x) => (
          <Button
            disabled={!switchNetwork || x.id === chain?.id}
            key={x.id}
            onClick={() => switchNetwork?.(x.id)}>
            Switch to {x.name}
            {status === 'loading' && x.id === pendingChainId && '…'}
          </Button>
        ))}
      </div>
      <div>{error && (error?.message ?? 'Failed to switch')}</div>
    </div>
  );
};

export default NetworkSwitcher;
