import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navigation from './Navigation';
import Tasks from './Tasks';
import Team from './Team';

function App() {
  return (
    <BrowserRouter>
        <div>
          <Navigation />
            <Switch>
             <Route path="/tasks" component={Tasks} exact/>
             <Route path="/team" component={Team}/>
           </Switch>
        </div> 
      </BrowserRouter>
  );
}

export default App;
