import {
  useAccount,
  useDisconnect
} from 'wagmi';

import Connect from 'src/components/Connect';
import NetworkSwitcher from 'src/components/NetworkSwitcher';

import { useIsMounted } from 'src/hooks';

const LiFi = () => {
  const isMounted = useIsMounted();

  const account = useAccount({
    onConnect: (data) => console.log('[onConnect] connected data => ', data),
    onDisconnect: () => console.log('[onDisconnect] disconnected')
  });

  const disconnect = useDisconnect();

  if (!isMounted) return null;

  return (
    <>
      <Connect />
      <NetworkSwitcher />
      <div>
        {isMounted && account?.connector?.name && (
          <div>Connected to {account.connector.name}</div>
        )}
        {account?.address && (
          <div>
            <button onClick={() => disconnect.disconnect()}>Disconnect</button>
          </div>
        )}
      </div>
    </>
  );
};

export default LiFi;