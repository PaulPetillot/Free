/* eslint-disable react/require-default-props */
import { Link } from 'react-router-dom'

import { Button } from '@chakra-ui/react'

import ROUTES from '../../utils/routes'
import Navbar from '../navbar/Navbar'

import {
  AppContainer,
  ChildrenContainer,
  HeaderContainer,
  LayoutContainer,
} from './Layout.styles'

function Layout({
  title,
  children,
  transparent,
  cta = false,
}: {
  title: string
  children: React.ReactNode
  transparent?: boolean
  cta?: boolean
}) {
  return (
    <AppContainer>
      <Navbar />
      <div style={{ flexGrow: 1 }}>
        <LayoutContainer>
          <HeaderContainer>
            <h1>{title}</h1>
            {cta && (
              <Link to={ROUTES.CREATE_PROJECT}>
                <Button
                  colorScheme="blue"
                  size="md"
                  fontWeight="bold"
                  borderRadius="full"
                  px="6"
                  _hover={{ bg: 'blue.600' }}
                >
                  Create Project
                </Button>
              </Link>
            )}
          </HeaderContainer>
          <ChildrenContainer $transparent={transparent}>
            {children}
          </ChildrenContainer>
        </LayoutContainer>
      </div>
    </AppContainer>
  )
}

Layout.defaultProps = {
  transparent: false,
}

export default Layout
