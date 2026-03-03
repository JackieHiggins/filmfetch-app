import styled from 'styled-components';

const Panel = styled.div`
  background-color: #222;
  padding: 40px;
  border-radius: 15px;
  width: 100%;
  max-width: ${props => props.$maxWidth || '400px'};
  text-align: center;
`;

export default Panel;