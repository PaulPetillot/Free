import { ConnectKitButton } from 'connectkit'
import { Link } from 'react-router-dom'

import ROUTES from '../../utils/routes'

import { NavbarContainer, Text } from './navbar.styles'

export default function Navbar() {
  return (
    <NavbarContainer>
      <Text>
        <a href={ROUTES.HOME}>Free</a>
      </Text>

      <ConnectKitButton />
    </NavbarContainer>
  )
}
