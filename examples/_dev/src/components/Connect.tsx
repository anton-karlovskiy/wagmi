import {
  useAccount,
  useConnect
} from 'wagmi';

import Button from 'src/components/Button';
import { useIsMounted } from 'src/hooks';

const Connect = () => {
  const isMounted = useIsMounted();
  const { connector, isReconnecting } = useAccount();
  const {
    connect,
    connectors,
    isLoading,
    error,
    pendingConnector
  } = useConnect();

  return (
    <div>
      <div
        className='space-x-2'>
        {connectors.map((x) => (
          <Button
            disabled={!x.ready || isReconnecting || connector?.id === x.id}
            key={x.name}
            onClick={() => connect({ connector: x })}>
            {x.id === 'injected' ? (isMounted ? x.name : x.id) : x.name}
            {isMounted && !x.ready && ' (unsupported)'}
            {isLoading && x.id === pendingConnector?.id && '…'}
          </Button>
        ))}
      </div>
      <div>{error && error.message}</div>
    </div>
  );
};

export default Connect;
