// This is the final screen that shows the movie that everyone in the lobby liked.
// It takes the matchId from the URL and pulls the movie details from the Firebase matches collection.
// Then it calls the Watchmode API one last time so it can display the streaming platforms like Netflix.
// I used a simple for loop to build the platform tags at the bottom to avoid messy inline logic.

import {useState, useEffect} from 'react';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import Layout from '../components/Layout';
import Container from '../components/Container';
import Panel from '../components/Panel';
import Tag from '../components/Tag';
import PrimaryButton from '../components/PrimaryButton';
import {getDocument} from '../utils/firebase';
import {getStreamingSources} from '../utils/watchmode';

const MatchTitle = styled.h1`
  color: #E50914;
  font-size: 40px;
  margin-bottom: 20px;
`;

const Poster = styled.img`
  width: 100%;
  border-radius: 5px;
`;

export default function Match(){
  const router = useRouter();
  const matchId = router.query.matchId;
  
  const [movie, setMovie] = useState(null);
  const [platforms, setPlatforms] = useState([]);

  useEffect(function(){
    if(matchId === undefined){
      return;
    }

    async function getData(){
      let dbMovie = await getDocument("liked_movies", matchId);
      
      if(dbMovie !== null){
        setMovie(dbMovie);
        
        let streamData = await getStreamingSources(dbMovie.tmdbId);
        
        let uniqueList = [];
        if(streamData !== undefined && streamData.length > 0){
            for(let i = 0; i < streamData.length; i++){
              let platformName = streamData[i].name;
              let isDuplicate = false;
              
              for(let j = 0; j < uniqueList.length; j++){
                  if(uniqueList[j] == platformName){
                    isDuplicate = true;
                  }
              }
              
              if(isDuplicate == false){
                  uniqueList.push(platformName);
              }
            }
        }
        
        setPlatforms(uniqueList);
      }
    }
    
    getData();
  }, [matchId]);

  function goHome(){
    router.push('/dashboard');
  }

  if(movie === null){
    return(
      <Layout>
        <Container>
          <h2 style={{color: 'white'}}>Error finding match.</h2>
        </Container>
      </Layout>
    );
  }

  let tags = [];
  for(let i = 0; i < platforms.length; i++){
    if(i < 3){
      tags.push(
        <Tag key={i}>{platforms[i]}</Tag>
      );
    }
  }

  return(
    <Layout>
      <Container>
        <MatchTitle>{"It's a Match!"}</MatchTitle>
        
        <Panel $borderColor="#E50914" $maxWidth="350px">
          <Poster src={"https://image.tmdb.org/t/p/w500" + movie.poster_path} alt="poster" />
          <h2 style={{color: 'white', marginTop: '15px'}}>{movie.title}</h2>
          
          <div style={{marginTop: '15px'}}>
            <p style={{color: 'gray', marginBottom: '10px'}}>Available on:</p>
            {tags}
          </div>
        </Panel>

        <PrimaryButton onClick={goHome} style={{marginTop: '30px'}}>Go Home</PrimaryButton>
      </Container>
    </Layout>
  );
}