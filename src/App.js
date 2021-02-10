import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navigation from './Navigation';
import Tasks from './Tasks';
import Team from './Team';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './store/reducers.js'

const state = {
  users: JSON.parse(localStorage.getItem('users')),
  tasks: JSON.parse(localStorage.getItem('tasks')),
}

const store = createStore(rootReducer,state);

function App() {
  return (
    <Provider store={store} >
      <BrowserRouter>
          <div>
            <Navigation />
              <Switch>
              <Route path="/tasks" component={Tasks} exact/>
              <Route path="/team" component={Team}/>
            </Switch>
          </div> 
        </BrowserRouter>
    </Provider>
  );
}

store.subscribe(() => {
  let state = store.getState();
  let users = state.users;
  let tasks = state.tasks;
  localStorage.setItem('users',JSON.stringify(users));
  localStorage.setItem('tasks',JSON.stringify(tasks));
})

export default App;
