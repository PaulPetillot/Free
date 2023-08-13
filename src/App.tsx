import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { goerli } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'

import { ChakraProvider } from '@chakra-ui/react'

import CreateProject from './pages/create-project/CreateProject'
import Home from './pages/home/Home'
import Project from './pages/project/Project'
import Projects from './pages/projects/Projects'
import ROUTES from './utils/routes'

const { chains } = configureChains(
  [goerli],
  [alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_API_KEY })]
)

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: import.meta.env.VITE_ALCHEMY_API_KEY,
    walletConnectProjectId: import.meta.env.VITE_WALLET_CONNECT_API_KEY,
    chains,

    // Required
    appName: 'Free',

    // Optional
    appDescription: 'Free is a decentralised freelancing platform.',
    // appUrl: 'https://family.co', // your app's url
    // appIcon: 'https://family.co/logo.png',
  })
)

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Home />,
  },
  {
    path: ROUTES.CREATE_PROJECT,
    element: <CreateProject />,
  },
  {
    path: ROUTES.PROJECTS,
    element: <Projects />,
  },
  {
    path: `${ROUTES.PROJECT}/:id`,
    element: <Project />,
  },
])

export default function App() {
  return (
    <ChakraProvider>
      <WagmiConfig config={config}>
        <ConnectKitProvider mode="dark">
          <RouterProvider router={router} />
        </ConnectKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  )
}
