import {
  useAccount,
  useDisconnect
} from 'wagmi';

import TransferringTokensExample from './TransferringTokensExample';
import Connect from 'src/components/Connect';
import NetworkSwitcher from 'src/components/NetworkSwitcher';
import { useIsMounted } from 'src/hooks';

const LiFi = () => {
  const isMounted = useIsMounted();

  const account = useAccount({
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
        {account.connector && (
          <div>Connected to {account.connector.name}</div>
        )}
        {account.address && (
          <div>
            <button onClick={() => disconnect.disconnect()}>Disconnect</button>
          </div>
        )}
      </div>
      <TransferringTokensExample />
    </>
  );
};

export default LiFi;