import styled from 'styled-components';

const Tag = styled.button`
  background-color: ${props => (props.$active ? '#E50914' : '#444')};
  color: white;
  padding: 12px 20px;
  margin: 8px;
  border: none;
  border-radius: 5px;
  cursor: ${props => (props.$clickable ? 'pointer' : 'default')};
`;

export default Tag;