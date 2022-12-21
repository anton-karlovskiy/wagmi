import {
  useAccount,
  useDisconnect
} from 'wagmi';

import TransferringTokensExample from './TransferringTokensExample';
import Connect from 'src/components/Connect';
import NetworkSwitcher from 'src/components/NetworkSwitcher';
import { useIsMounted } from 'src/hooks';

// LI.FI Use cases
// - Swap tokens on a single chain
// - Bridge tokens between different two chains (cross-chain transfer)

const LiFi = () => {
  const isMounted = useIsMounted();

  const {
    connector,
    address,
    isConnected
  } = useAccount({
    onConnect: (data) => console.log('[LiFi onConnect] connected data => ', data),
    onDisconnect: () => console.log('[LiFi onDisconnect] disconnected')
  });

  const disconnect = useDisconnect();

  if (!isMounted) return null;

  return (
    <>
      <Connect />
      <NetworkSwitcher />
      <div>
        {connector && (
          <div>Connected to {connector.name}</div>
        )}
        {address && (
          <div>
            <button onClick={() => disconnect.disconnect()}>Disconnect</button>
          </div>
        )}
      </div>
      {isConnected && <TransferringTokensExample />}
    </>
  );
};

export default LiFi;