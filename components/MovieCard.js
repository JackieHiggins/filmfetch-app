import styled from 'styled-components';
import Tag from './Tag';

const Card = styled.div`
  background-color: #222;
  border-radius: 10px;
  overflow: hidden;
  text-align: left;
`;

const MovieImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const InfoBox = styled.div`
  padding: 20px;
  color: white;
`;

const Title = styled.h2`
  margin: 0 0 10px 0;
  color: #ffffff;
`;

const Summary = styled.p`
  margin: 0 0 15px 0;
  color: #ccc;
  font-size: 14px;
  line-height: 1.4;
`;

const StreamingSection = styled.div`
  margin-top: 15px;
`;

const StreamingLabel = styled.p`
  margin: 0 0 5px 0;
  color: gray;
  font-size: 14px;
`;

const PlatformTag = styled(Tag)`
  padding: 6px 12px;
  font-size: 12px;
  margin: 3px;
`;

export default function MovieCard({ movie, imageLink, platforms = [] }) {
  if (!movie) return null;
  
  let shortSummary = movie.overview;
  if (shortSummary.length > 150) {
    shortSummary = shortSummary.substring(0, 150) + "...";
  }

  let platformTagsToDisplay = [];
  if (platforms.length > 0) {
    for (let i = 0; i < platforms.length; i++) {
      if (i === 3) {
        break; 
      }
      platformTagsToDisplay.push(
        <PlatformTag key={i}>
          {platforms[i]}
        </PlatformTag>
      );
    }
  }

  return (
    <Card>
      <MovieImage src={imageLink} alt={movie.title} />
      <InfoBox>
        <Title>{movie.title}</Title>
        <Summary>{shortSummary}</Summary>
        
        <StreamingSection>
          <StreamingLabel>Available on:</StreamingLabel>
          {platformTagsToDisplay}
        </StreamingSection>
      </InfoBox>
    </Card>
  );
}