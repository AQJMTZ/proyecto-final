import "./App.css";
import React, { Component } from "react";
import Chat from "./Chat/Chat";
import Login from "./Login/Login";
import { io } from "socket.io-client";
import bigInt from "big-integer";

const aValue = 17123207;
const qValue = 2426697107;
class App extends Component {
  state = {
    server: "localhost:2021",
    chatEnabled: false,
    socket: "",
    cryptoKey: "11111111",
    xValue: "",
    yValue: 0,
    startingConversation: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      server: "localhost:2021",
      chatEnabled: false,
      cryptoKey: "",
      startingConversation: true,
    };
  }

  handleTextFieldOnChange = (e) => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  handleChecked = (event) => {
    this.setState({ startingConversation: event.target.checked });
  };

  handleLoginOnSubmit = (e) => {
    e.preventDefault();
    const server = `http://${this.state.server}`;
    const yValue = this.diffieHellman();
    this.setState({ server, chatEnabled: true, socket: io(server), yValue });
  };

  diffieHellman = () => {
    const x = parseInt(this.state.xValue);
    const y = bigInt(aValue).modPow(x, qValue).toString();
    console.log("first Y: ", y)
    return y;
  };

  powerMod(base, exponent, modulus) {
    if (modulus === 1) return 0;
    var result = 1;
    base = base % modulus;
    while (exponent > 0) {
      if (exponent % 2 === 1)
        result = (result * base) % modulus;
      exponent = exponent >> 1; 
      base = (base * base) % modulus;
    }
    return result;
  }

  handleKeyChange = (newKey) => {
    this.setState({ cryptoKey: newKey });
  };
  render() {
    return (
      <div className="App">
        {/*hola profe */}
        {this.state.chatEnabled ? (
          <Chat
            socket={this.state.socket}
            cryptoKey={this.state.cryptoKey}
            yValue={this.state.yValue}
            xValue={this.state.xValue}
            startingConversation={this.state.startingConversation}
            handleKeyChange={this.handleKeyChange}
          />
        ) : (
          <Login
            handleLoginOnSubmit={this.handleLoginOnSubmit}
            handleTextFieldOnChange={this.handleTextFieldOnChange}
            server={this.state.server}
            xValue={this.state.xValue}
            startingConversation={this.state.startingConversation}
            handleChecked={this.handleChecked}
          />
        )}
      </div>
    );
  }
}

export default App;
