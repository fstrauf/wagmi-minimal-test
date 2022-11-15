import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react';

import {
  WagmiConfig,
  createClient,
  configureChains,
  chain,
} from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'

const { chains, provider, webSocketProvider } = configureChains(
  [chain.mainnet, chain.optimism],
  [publicProvider()],
)

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
})


export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
      </SessionProvider>
    </WagmiConfig>
  )
}
