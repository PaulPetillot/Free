import Navbar from '../navbar/Navbar'

import {
  ChildrenContainer,
  HeaderContainer,
  LayoutContainer,
  AppContainer,
} from './Layout.styles'

function Layout({
  title,
  children,
  transparent,
}: {
  title: string
  children: React.ReactNode
  transparent?: boolean
}) {
  return (
    <AppContainer>
      <Navbar />
      <div style={{ flexGrow: 1 }}>
        <LayoutContainer>
          <HeaderContainer>
            <h1>{title}</h1>
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
