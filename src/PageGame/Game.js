import React, { Component } from 'react';
import io from 'socket.io-client';
import './Game.css';
import Action from '../Action/Action';
import Decision from '../Decision/Decision';
import Chat from '../Chat/Chat';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userNumber: '',
      activity: false,
      decision: '',
      messages: [],
    };
    this.actions = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
    this.connection = io('http://localhost:4001');
    this.changeActivity = this.changeActivity.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.submitMessage = this.submitMessage.bind(this);
  }
  componentDidMount() {
    this.connection.on('count', (countUsers) => {
      this.setState({ userNumber: countUsers });
      console.log(countUsers);
    });
  }
  componentDidUpdate() {
    this.connection.on('decision', (decision) => {
      this.setState({ decision });
    });
    this.connection.on('chat message', (msg) => {
      this.setState({ messages: [...this.state.messages, msg] });
    });
  }
  changeActivity() {
    this.setState({ activity: !this.state.activity });
  }
  handleSubmit(e) {
    const choice = e.target.textContent;
    this.connection.emit('user choice', choice);
    this.setState({ activity: !this.state.activity });
  }
  submitMessage(e) {
    e.preventDefault();
    const input = e.target.message;
    this.connection.emit('chat message', input.value);
    input.value = '';
  }
  render() {
    return (
      <div className="page_game">
        <h1 className="title">Страница игры. Вы игрок {this.state.userNumber}</h1>
        <Action
          submit={this.handleSubmit}
          activity={this.state.activity}
          actions={this.actions}
        />
        <Decision
          content={this.state.decision}
          activity={this.changeActivity}
        />
        <Chat
          messages={this.state.messages}
          submitMessage={this.submitMessage}
        />
      </div>
    );
  }
}