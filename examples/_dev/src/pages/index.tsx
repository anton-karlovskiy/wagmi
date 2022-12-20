import {
  Account,
  Connect,
  NetworkSwitcher
} from '../components';
import { useIsMounted } from '../hooks';

const Home = () => {
  const isMounted = useIsMounted();

  if (!isMounted) return null;

  return (
    <>
      <Connect />
      <NetworkSwitcher />
      <Account />
    </>
  );
};

export default Home;
