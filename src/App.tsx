import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { goerli } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'

import { ChakraProvider } from '@chakra-ui/react'

import Navbar from './components/navbar/Navbar'
import CreateProject from './pages/create-project/CreateProject'
import Home from './pages/home/Home'
import ProjectPage from './pages/project/Project'
import Projects from './pages/projects/Projects'
import ROUTES from './utils/routes'

const { chains } = configureChains(
  [goerli],
  [alchemyProvider({ apiKey: 'B3aGk4zeqEFqD-i4mDB9xjssz7EHgZ5s' })]
)

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: 'B3aGk4zeqEFqD-i4mDB9xjssz7EHgZ5s',
    walletConnectProjectId: '2df14c762b6473c5cad22cc983077f1d',
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
    element: <ProjectPage />,
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
