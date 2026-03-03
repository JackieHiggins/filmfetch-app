// This is the landing page for the whole app and it handles all the authentication stuff.
// It uses Firebase to let people either log in or sign up if they do not have an account yet.
// I used a state toggle for isLogin so the form switches between the two modes without making a new page.
// Once handleAuth is successful, it uses the Next.js router to push the user to the dashboard so they can start.

import {useState} from 'react';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import Layout from '../components/Layout';
import Container from '../components/Container';
import Panel from '../components/Panel';
import Input from '../components/Input';
import PrimaryButton from '../components/PrimaryButton';
import {loginUser, register} from '../utils/firebase';

const Title = styled.h1`
  color: #E50914;
  font-size: 40px;
  margin-bottom: 20px;
`;

const SwitchText = styled.p`
  color: #888;
  cursor: pointer;
  margin-top: 15px;
`;

export default function Home(){
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function handleAuth(){
    try{
      if(isLogin == true){
        await loginUser(email, password);
      }else{
        await register(email, password);
      }
      router.push('/dashboard'); 
    }catch(error){
      alert("Error logging in.");
    }
  }

  function toggleMode(){
    if(isLogin == true){
      setIsLogin(false);
    }else{
      setIsLogin(true);
    }
  }

  return(
    <Layout>
      <Container>
        <Panel>
          <h2 style={{color: 'white'}}>{isLogin ? 'Login' : 'Sign Up'}</h2>
          
          <Input placeholder="Email" type="email" value={email} onChange={function(e){setEmail(e.target.value)}} />
          <Input placeholder="Password" type="password" value={password} onChange={function(e){setPassword(e.target.value)}} />
          
          <PrimaryButton onClick={handleAuth} style={{width: '100%'}}>Submit</PrimaryButton>

          <SwitchText onClick={toggleMode}>
            Switch to {isLogin ? 'Sign Up' : 'Login'}
          </SwitchText>
        </Panel>
      </Container>
    </Layout>
  );
}