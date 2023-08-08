import styled, { keyframes } from 'styled-components';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
`;

export const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 2rem 4rem 0.8rem 4rem;
  gap: 2rem;
  margin-bottom: 4rem;
`;

export const Text = styled.span`
  font-weight: bold;
  font-size: 1.5rem;
  background: linear-gradient(
    90deg,
    #f6d365 0%,
    #fda085 25%,
    #f6c1ff 50%,
    #ffaec0 75%,
    #f6d365 100%
  );
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  animation: ${gradientAnimation} 3s linear infinite;
`;
