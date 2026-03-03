// This is the main menu where the user decides between hosting a new group or joining an existing one.
// I am using the showJoin state variable to ensure the input box for the room code only appears when needed.
// The code calls the getDocument function from Firebase to verify if the room code entered by the user exists.
// If a matching lobby is found, the user is redirected to the swipe page with the lobby code in the URL.

import {useState} from 'react';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import Layout from '../components/Layout';
import Container from '../components/Container';
import Panel from '../components/Panel';
import Input from '../components/Input';
import PrimaryButton from '../components/PrimaryButton';
import {getDocument} from '../utils/firebase';

const Divider = styled.p`
  color: gray;
  margin: 30px 0;
  font-size: 18px;
`;

export default function Dashboard(){
  const [showJoin, setShowJoin] = useState(false);
  const [lobbyCode, setLobbyCode] = useState('');
  const router = useRouter();

  async function handleJoin(){
    if(lobbyCode !== ""){
      let upperCode = lobbyCode.toUpperCase();
      let lobbyData = await getDocument("lobbies", upperCode);
      
      if(lobbyData !== null){
        router.push("/swipe?lobby=" + upperCode);
      }else{
        alert("Lobby not found. Please check the code.");
      }
    }else{
      alert("Please enter a code");
    }
  }

  function goToHostLobby(){
    router.push('/lobby');
  }

  function openJoinMenu(){
    setShowJoin(true);
  }

  function updateCode(e){
    setLobbyCode(e.target.value);
  }

  return(
    <Layout>
      <Container>
        <Panel $maxWidth="500px">
          <h2 style={{color: 'white', fontSize: '32px', marginBottom: '30px'}}>Main Menu</h2>
          
          <PrimaryButton onClick={goToHostLobby} style={{width: '100%'}}>
            Host New Lobby
          </PrimaryButton>

          <Divider>OR</Divider>

          {showJoin == false && (
            <PrimaryButton onClick={openJoinMenu} style={{width: '100%'}}>
              Join Existing Lobby
            </PrimaryButton>
          )}

          {showJoin == true && (
            <div>
              <Input 
                placeholder="ENTER CODE" 
                value={lobbyCode} 
                onChange={updateCode} 
                maxLength={6} 
                $centered 
                $uppercase 
              />
              <PrimaryButton onClick={handleJoin} style={{width: '100%'}}>
                Enter Lobby
              </PrimaryButton>
            </div>
          )}
        </Panel>
      </Container>
    </Layout>
  );
}