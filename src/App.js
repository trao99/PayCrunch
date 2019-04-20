import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor(){
    super();
    this.state = {
        budget: 10
    };
  }

  componentDidMount() {

    const rootRef = firebase.database().ref().child('react');
    const budgetRef = rootRef.child('budget');
    budgetRef.on('value',snap => {
        this.setState({
            budget: snap.val{}
        });
    });
  }

  render() {
    return (
      <div className = "App">
        <h1>{this.state.budget}</h1>
      </div>
    );
  }
}

export default App;
