import styled from 'styled-components';
import { useRouter } from 'next/router';
import { FaFilm, FaUserCircle } from 'react-icons/fa';

const Background = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: #121212;
  color: white;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', sans-serif;
`;

const Nav = styled.nav`
  width: 100%;
  height: 70px;
  background-color: #000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  box-sizing: border-box;
  border-bottom: 1px solid #333;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  color: #E50914;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default function Layout({ children }) {
  const router = useRouter();
  return (
    <Background>
      <Nav>
        <Logo onClick={() => router.push('/')}>
          <FaFilm /> FILMFETCH
        </Logo>
      </Nav>
      <MainContent>{children}</MainContent>
    </Background>
  );
}