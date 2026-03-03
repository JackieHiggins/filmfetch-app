// This page lets the host set up the room before anyone starts swiping on movies.
// It has a random code generator that picks 6 letters and numbers to create a unique lobby ID.
// There are loops at the top to build the filter tags for genres and streaming services like Netflix or Hulu.
// When you click create, it saves the host name and the settings to Firebase and then moves to the swipe screen.

import {useState} from 'react';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import Layout from '../components/Layout';
import Container from '../components/Container';
import Panel from '../components/Panel';
import Input from '../components/Input';
import Tag from '../components/Tag';
import PrimaryButton from '../components/PrimaryButton';
import {setDocument} from '../utils/firebase';

const Heading = styled.h3`
  color: #ffffff;
  padding-bottom: 10px;
  margin-top: 30px;
`;

export default function Lobby(){
  const router = useRouter();
  const [hostName, setHostName] = useState('GuestUser');

  let streamingOptions = ["Netflix", "Hulu", "Disney+", "Max", "Amazon Prime"];
  let genreOptions = ["Action", "Comedy", "Horror", "Romance", "Sci-Fi", "Thriller"];

  let streamTags = [];
  for(let i = 0; i < streamingOptions.length; i++){
    let opt = streamingOptions[i];
    let active = false;
    if(opt == "Netflix" || opt == "Max"){
      active = true;
    }
    
    streamTags.push(
      <Tag key={i} $active={active} $clickable={true}>{opt}</Tag>
    );
  }

  let genreTags = [];
  for(let i = 0; i < genreOptions.length; i++){
    let genre = genreOptions[i];
    let active = false;
    if(genre == "Action" || genre == "Sci-Fi"){
      active = true;
    }

    genreTags.push(
      <Tag key={i} $active={active} $clickable={true}>{genre}</Tag>
    );
  }

  async function createLobby(){
    let code = "";
    let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for(let i = 0; i < 6; i++){
      let randomIndex = Math.floor(Math.random() * letters.length);
      code += letters[randomIndex];
    }

    await setDocument("lobbies", code, {host: hostName});
    router.push("/swipe?lobby=" + code);
  }

  function updateHostName(e){
    setHostName(e.target.value);
  }

  return(
    <Layout>
      <Container>
        <h1 style={{color: 'white', fontSize: '40px'}}>Lobby Settings</h1>
        
        <Panel $maxWidth="700px">
          <Heading>1. Host Profile</Heading>
          <Input type="text" value={hostName} onChange={updateHostName} />

          <Heading>2. Filters</Heading>
          <p style={{color: 'gray'}}>Select streaming services:</p>
          <div>
            {streamTags}
          </div>

          <p style={{color: 'gray', marginTop: '20px'}}>Select favorite genres:</p>
          <div>
            {genreTags}
          </div>

          <PrimaryButton $color="red" onClick={createLobby} style={{marginTop: '40px', width: '100%', fontSize: '22px'}}>
            Create Lobby
          </PrimaryButton>
        </Panel>
      </Container>
    </Layout>
  );
}