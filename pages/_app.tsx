import '../styles/globals.css'
import type { AppProps } from 'next/app'
// import { SessionProvider } from 'next-auth/react';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
// import {
//   WagmiConfig,
//   createClient,
//   configureChains,
//   chain,
// } from 'wagmi'
// import { publicProvider } from 'wagmi/providers/public'
import { useRouter } from 'next/router';

const publicPages = ["/"];

// const { chains, provider, webSocketProvider } = configureChains(
//   [chain.mainnet, chain.optimism],
//   [publicProvider()],
// )

// const client = createClient({
//   autoConnect: true,
//   provider,
//   webSocketProvider,
// })


export default function App({ Component, pageProps }: AppProps) {

  const { pathname } = useRouter();

  // Check if the current route matches a public page
  const isPublicPage = publicPages.includes(pathname);
  return (
    // <WagmiConfig client={client}>
      // <SessionProvider session={pageProps.session}>
      <ClerkProvider {...pageProps}>
      {isPublicPage ? (
      <Component {...pageProps} />
      ) : (
        <>
          <SignedIn>
            <Component {...pageProps} />
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </>
      )}
    </ClerkProvider>
      // {/* </SessionProvider> */}
    // </WagmiConfig>
  )
}
