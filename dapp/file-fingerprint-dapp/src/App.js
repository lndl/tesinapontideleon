import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react'

import { BrowserRouter as Router, Route } from 'react-router-dom'

import FFMenu from './components/FFMenu.js'
import FFForm from './components/FFForm.js'
import FFList from './components/FFList.js'

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <React.Fragment>
            <FFMenu />
            <Grid padded centered columns={1}>
              <Grid.Column width={16}>
                <h2> Huella en la Blockchain </h2>

                <Route path="/new_certification" component={FFForm} />
                <Route exact path="/" component={FFList} />
              </Grid.Column>
            </Grid>
          </React.Fragment>
        </Router>
      </div>
    );
  }
}

export default App;
