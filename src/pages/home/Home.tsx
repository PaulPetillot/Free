import { Link } from 'react-router-dom'
import { useAccount, useConnect } from 'wagmi'

import Layout from '../../components/layout/Layout'
import ROUTES from '../../utils/routes'

import {
  BodyContainer,
  Button,
  ButtonsContainer,
  Header,
  Header1,
  Header2,
  HeaderContainer,
} from './home.styles'

export default function Home() {
  const { address } = useAccount()
  const { connect, connectors } = useConnect()

  return (
    <Layout transparent title="">
      <HeaderContainer>
        <Header>
          <Header1>Free.</Header1>
          <Header2>The ultimate decentralised freelancing platform.</Header2>
        </Header>
      </HeaderContainer>
      <BodyContainer>
        <ButtonsContainer>
          {address ? (
            <Button>
              <Link to={ROUTES.PROJECTS}>Get Started</Link>
            </Button>
          ) : (
            <Button onClick={() => connect({ connector: connectors[0] })}>
              Connect Wallet
            </Button>
          )}
        </ButtonsContainer>
      </BodyContainer>
    </Layout>
  )
}
