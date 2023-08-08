import { styled } from 'styled-components'

export const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: fit-content;
`

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    background: linear-gradient(
      to left bottom,
      #d9d9d9,
      #c0bace,
      #b7a1c7,
      #ca90da,
      #db87d8,
      #db87d8,
      #dc87d9,
      #dc87d9,
      #dda9ea,
      #bfa1d6,
      #c7bed6,
      #d3cfcf
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
    font-size: 64px;
    font-weight: bold;
    color: white;
  }
`

export const ChildrenContainer = styled.div<{ $transparent?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
  background-color: ${({ $transparent }) =>
    $transparent ? 'transparent' : '#fff'};
  border: ${({ $transparent }) =>
    $transparent ? 'none' : '1px solid #919191'};
  border-radius: 10px;
  padding: 2rem;
`
