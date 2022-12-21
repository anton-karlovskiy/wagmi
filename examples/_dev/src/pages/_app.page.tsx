import type { AppProps } from 'next/app'
import NextHead from 'next/head'
import {
  WagmiConfig,
  chain,
  configureChains,
  createClient,
  defaultChains,
} from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { avalanche } from '../config/chains';
import 'src/styles/globals.css';

const queryClient = new QueryClient();

const { chains, provider, webSocketProvider } = configureChains(
  [...defaultChains, chain.optimism, avalanche],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY! }),
    infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY! }),
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id !== avalanche.id) return null
        return {
          http: chain.rpcUrls.default,
        }
      },
    }),
    publicProvider(),
  ],
  { targetQuorum: 1 },
)

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        UNSTABLE_shimOnConnectSelectAccount: true,
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: (detectedName) =>
          `Injected (${
            typeof detectedName === 'string'
              ? detectedName
              : detectedName.join(', ')
          })`,
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
})

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <NextHead>
        <title>wagmi</title>
      </NextHead>
      <QueryClientProvider client={queryClient}>
        <WagmiConfig client={client}>
          <Component {...pageProps} />
        </WagmiConfig>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  )
}

export default App
