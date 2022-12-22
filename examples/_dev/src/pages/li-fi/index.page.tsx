import {
  useAccount,
  useDisconnect
} from 'wagmi';
import clsx from 'clsx';

import TransferringTokensExample from './TransferringTokensExample';
import Connect from 'src/components/Connect';
import NetworkSwitcher from 'src/components/NetworkSwitcher';
import Button from 'src/components/Button';
import { useIsMounted } from 'src/hooks';

// LI.FI Use cases
// - Swap tokens on a single chain (feasible in this example)
// - Bridge tokens between different two chains (cross-chain transfer) (feasible in this example)
// - Swap tokens between different two chains (cross-chain swap) (feasible in this example)

const LiFi = () => {
  const isMounted = useIsMounted();

  const {
    connector,
    isConnected
  } = useAccount({
    onConnect: (data) => console.log('[LiFi onConnect] connected data => ', data),
    onDisconnect: () => console.log('[LiFi onDisconnect] disconnected')
  });

  const disconnect = useDisconnect();

  if (!isMounted) return null;

  return (
    <div
      className={clsx(
        'space-y-6',
        'p-6'
      )}>
      <Connect />
      <NetworkSwitcher />
      <div>
        {connector && (
          <p>Connected to {connector.name}</p>
        )}
        {isConnected && (
          <Button onClick={() => disconnect.disconnect()}>Disconnect</Button>
        )}
      </div>
      {isConnected && <TransferringTokensExample />}
    </div>
  );
};

export default LiFi;