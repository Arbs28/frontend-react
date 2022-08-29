import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Products from './components/products';
import Category from './components/categories';
import { Button } from 'semantic-ui-react';
import { API, Auth } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react'; 
import '@aws-amplify/ui-react/styles.css';



function App() {
  async function callApi(){
    const user = await Auth.currentAuthenticatedUser()
    const token = user.signInUserSession.idToken.jwtToken
    console.log({ token })

    const requestInfo = {
      headers: {
          Authorization: token
      }
    }
    const data = await API.get('apiarb', '/products', requestInfo)
    console.log({ data })
  }
  return (
    <Router>
      <Button onClick={callApi} style={{margin:"10px"}}> Call Api </Button>
      <Route exact path="/" component={Products}/>
      <Route path="/categories" component={Category}/>
    </Router>
  );
}

export default withAuthenticator(App);
