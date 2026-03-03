import styled from 'styled-components';

const Input = styled.input`
  width: 90%;
  padding: 15px;
  margin-bottom: 15px;
  font-size: 16px;
  border-radius: 5px;
  background-color: #111;
  color: white;
  text-align: ${props => props.$centered ? 'center' : 'left'};
  text-transform: ${props => props.$uppercase ? 'uppercase' : 'none'};
`;

export default Input;