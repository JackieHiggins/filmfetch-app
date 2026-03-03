// This page is like a hub where users wait for everyone in the room to finish swiping.
// It uses onSnapshot from Firestore to listen for changes to the lobby document in real time.
// When it sees that two people have submitted their choices, it runs a loop to find a mutual match.
// If it finds a movie that both people liked, it saves that to a matches collection and redirects.

import {useEffect} from 'react';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import Layout from '../components/Layout';
import Container from '../components/Container';
import Panel from '../components/Panel';
import {doc, onSnapshot} from 'firebase/firestore';
import {database, createDocument} from '../utils/firebase';

const StatusText = styled.h3`
  color: #E50914;
  margin-top: 30px;
  font-size: 24px;
`;

export default function Waiting(){
  const router = useRouter();
  const currentLobbyCode = router.query.lobby;

  useEffect(function(){
    if(currentLobbyCode === undefined){
      return;
    }

    let documentReference = doc(database, "lobbies", currentLobbyCode);
    
    let stopListening = onSnapshot(documentReference, async function(snapshot){
      let data = snapshot.data();
      console.log(data); 
      
      if(data !== undefined && data.submissions !== undefined){
        if(data.submissions.length >= 2){
          
          let user1Choices = data.submissions[0].choices;
          let user2Choices = data.submissions[1].choices;
          let mutualMatch = null;

          for(let i = 0; i < user1Choices.length; i++){
            for(let j = 0; j < user2Choices.length; j++){
              if(user1Choices[i].id == user2Choices[j].id){
                console.log("MATCH FOUND");
                mutualMatch = user1Choices[i];
              }
            }
          }

          if(mutualMatch !== null){
            let matchDocId = await createDocument("liked_movies", {
              title: mutualMatch.title,
              tmdbId: mutualMatch.id,
              poster_path: mutualMatch.poster_path
            });
            
            router.push("/match?matchId=" + matchDocId);
          }else{
            alert("No matches found. Try again.");
            router.push("/dashboard");
          }
        }
      }
    });

    return function(){
      stopListening();
    };
  }, [currentLobbyCode]);

  return(
    <Layout>
      <Container>
        <Panel>
          <h2 style={{color: 'white'}}>Waiting for other players</h2>
          <p style={{color: 'gray'}}>Stay on this page until everyone is done.</p>
          <StatusText>Waiting...</StatusText>
        </Panel>
      </Container>
    </Layout>
  );
}