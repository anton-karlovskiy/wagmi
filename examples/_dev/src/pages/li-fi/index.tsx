// ray test touch <
import Connect from 'src/components/Connect';
import NetworkSwitcher from 'src/components/NetworkSwitcher';

import { useIsMounted } from 'src/hooks';

const LiFi = () => {
  const isMounted = useIsMounted();

  if (!isMounted) return null;

  return (
    <>
      <Connect />
      <NetworkSwitcher />
    </>
  );
};

export default LiFi;
// ray test touch >