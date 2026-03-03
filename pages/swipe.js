// This is the core of the app where the movie swiping actually happens.
// It fetches a list of movies from the TMDB API and also gets streaming info from Watchmode for each one.
// There is a function called handleChoice that handles the like/pass logic and tracks which movies you liked.
// Once you finish all the movies, it batches your choices and saves them to your specific lobby doc in Firebase.

import {useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import Layout from '../components/Layout';
import Container from '../components/Container';
import Banner from '../components/Banner';
import Panel from '../components/Panel';
import MovieCard from '../components/MovieCard';
import PrimaryButton from '../components/PrimaryButton';
import {fetchMoviesByGenre} from '../utils/tmdb';
import {getDocument, setDocument} from '../utils/firebase';
import {getStreamingSources} from '../utils/watchmode';

export default function Swipe(){
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedMovies, setLikedMovies] = useState([]);
  const [platforms, setPlatforms] = useState([]); 
  
  const router = useRouter();
  const currentLobbyCode = router.query.lobby;

  async function loadPlatformsForMovie(movieToLoad){
    setPlatforms([]); 
    
    let streamData = await getStreamingSources(movieToLoad.id);
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
    
    if(uniqueList.length === 0){
      uniqueList.push("Unavailable");
    }

    setPlatforms(uniqueList);
  }

  useEffect(function(){
    async function initialLoad(){
      let results = await fetchMoviesByGenre();
      setMovies(results);
      
      if(results.length > 0){
        await loadPlatformsForMovie(results[0]);
      }
    }
    
    initialLoad();
  }, []);

  async function handleChoice(liked){
    try{
      let currentMovie = movies[currentIndex];
      
      let newLikes = likedMovies.concat([]);
      
      if(liked == true){
        newLikes.push(currentMovie);
        setLikedMovies(newLikes);
      }

      if(currentIndex < movies.length - 1){
        let nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        
        await loadPlatformsForMovie(movies[nextIndex]);
        
      }else{
        if(currentLobbyCode === undefined){
          alert("No lobby code.");
          return;
        }

        let lobbyData = await getDocument("lobbies", currentLobbyCode);
        if(lobbyData === null){
          lobbyData = {host: "Unknown"}; 
        }
        
        let allSubmissions = [];
        if(lobbyData.submissions !== undefined){
          allSubmissions = lobbyData.submissions;
        }
        
        allSubmissions.push({choices: newLikes});
        
        await setDocument("lobbies", currentLobbyCode, {
          host: lobbyData.host,
          submissions: allSubmissions
        });

        router.push("/waiting?lobby=" + currentLobbyCode);
      }
    }catch(error){
      console.log(error);
      alert("Something went wrong saving your choices.");
    }
  }

  function handlePass(){
    handleChoice(false);
  }

  function handleLike(){
    handleChoice(true);
  }

  if(movies.length === 0){
    return(
      <Layout>
        <Container>
          <h2 style={{color: 'white'}}>Loading...</h2>
        </Container>
      </Layout>
    );
  }

  let currentMovie = movies[currentIndex];
  let posterUrl = "https://image.tmdb.org/t/p/w500" + currentMovie.poster_path;

  return(
    <Layout>
      <Container>
        <Banner>LOBBY: {currentLobbyCode}</Banner>
        
        <Panel $maxWidth="400px">
          <MovieCard 
            movie={currentMovie} 
            imageLink={posterUrl} 
            platforms={platforms} 
          />
          
          <div style={{marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '15px'}}>
            <PrimaryButton type="button" onClick={handlePass} $outline={true}>PASS</PrimaryButton>
            <PrimaryButton type="button" onClick={handleLike}>LIKE</PrimaryButton>
          </div>
        </Panel>
      </Container>
    </Layout>
  );
}