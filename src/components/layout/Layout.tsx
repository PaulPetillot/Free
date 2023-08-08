import {
  ChildrenContainer,
  HeaderContainer,
  LayoutContainer,
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
    <LayoutContainer>
      <HeaderContainer>
        <h1>{title}</h1>
      </HeaderContainer>
      <ChildrenContainer $transparent={transparent}>
        {children}
      </ChildrenContainer>
    </LayoutContainer>
  )
}

Layout.defaultProps = {
  transparent: false,
}

export default Layout
