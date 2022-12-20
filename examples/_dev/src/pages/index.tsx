import Examples from '../components/Examples';
import { Connect } from '../components/Connect';
import { NetworkSwitcher } from '../components/NetworkSwitcher';
import { useIsMounted } from '../hooks';

const Home = () => {
  const isMounted = useIsMounted();

  if (!isMounted) return null;

  return (
    <>
      <Connect />
      <NetworkSwitcher />
      <Examples />
    </>
  );
};

export default Home;
