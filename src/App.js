import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Products from './components/products';
import Category from './components/categories';

function App() {
  return (
    <Router>
      <Route exact path="/" component={Products}/>
      <Route path="/categories" component={Category}/>
    </Router>
  );
}

export default App;
