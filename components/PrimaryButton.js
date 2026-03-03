import styled from 'styled-components';

const Button = styled.button`
  background-color: ${props => props.$outline ? 'transparent' : '#E50914'};
  color: ${props => props.$outline ? '#E50914' : '#ffffff'};
  border: ${props => props.$outline ? '2px solid #E50914' : 'none'};
  padding: 15px 30px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

export default Button;