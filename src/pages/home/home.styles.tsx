import styled, { keyframes } from 'styled-components'

export const Container = styled.div``

export const HeaderContainer = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const Header = styled.div`
  text-align: center;
`

export const Header1 = styled.h1`
  font-size: 64px;
  background: linear-gradient(
    to left bottom,
    #ff26bb,
    #ff3ec1,
    #ff50c6,
    #ff5fcb,
    #ff6cd0,
    #ff6ed2,
    #ff70d3,
    #ff72d5,
    #ff6ad4,
    #ff62d4,
    #ff59d3,
    #ff4fd3
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  font-weight: bold;
`

export const Header2 = styled.h2`
  background: linear-gradient(
    to left bottom,
    #fcfcfc,
    #eae2fa,
    #e0c6f4,
    #dba8e9,
    #db87d8,
    #db87d8,
    #dc87d9,
    #dc87d9,
    #dda9ea,
    #e2c7f6,
    #ede4fd,
    #ffffff
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  font-size: 48px;
  font-weight: bold;
`

export const BodyContainer = styled.div`
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  color: white;
`

const Slidebg = keyframes`
  to {
    background-position: 20vw;
  }
`

export const Button = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 250px;
  height: 80px;
  background: #ec82ff;
  font-weight: bold;
  font-size: 1.5rem;
  color: white;
  box-shadow: 2px 2px 3px rgb(142, 142, 142);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.5s;

  &:hover {
    background-image: linear-gradient(
      90deg,
      #f6d365 0%,
      #fda085 25%,
      #f6c1ff 50%,
      #ffaec0 75%,
      #f6d365 100%
    );
    animation: ${Slidebg} 5s linear infinite;
    box-shadow: 6px 6px 6px rgb(234, 234, 234);
    transform: translateY(-3px);
  }
`

export const ButtonParagraph = styled.p`
  font-style: normal;
  font-size: 18px;
  line-height: 28px;
`
