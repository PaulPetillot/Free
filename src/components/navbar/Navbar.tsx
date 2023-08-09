import { ConnectKitButton } from 'connectkit'
import { Link } from 'react-router-dom'
import { useAccount } from 'wagmi'

import ROUTES from '../../utils/routes'

import { NavbarContainer, Text } from './navbar.styles'

export default function Navbar() {
  const { address } = useAccount()

  return (
    <NavbarContainer>
      <Text>
        <Link to={address ? ROUTES.PROJECTS : ROUTES.HOME}>Free</Link>
      </Text>

      <ConnectKitButton />
    </NavbarContainer>
  )
}
