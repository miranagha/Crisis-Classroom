import React, { Component } from "react";
import { Link } from "react-router-dom";
import Input from "../../input";
import Button from "../../button";
import Label from "../../label";
import AuthService from "../../../Auth/AuthService";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: ""
    };

    this.Auth = AuthService;
  }

  componentWillMount() {
    if (this.Auth.loggedIn()) this.props.history.replace("/");
  }
  onSubmit = e => {
    e.preventDefault();

    this.Auth.login(this.state.userName, this.state.password)
      .then(res => {
        if (this.Auth.loggedIn()) this.props.history.replace("/welecome");
      })
      .catch(err => {
        alert(err);
      });
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  render() {
    return (
      <div>
        <h3>To See Templates Please Login</h3>
        <div className="login-form">
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <Label value="Username *" />
              <Input
                className="form-control"
                name="userName"
                type="text"
                placeholder="Username"
                value={this.state.userName}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <Label value="Password *" />
              <Input
                className="form-control"
                name="password"
                type="password"
                placeholder="Password"
                value={this.state.password}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <h5>Forgotten password?</h5>

              <div className="row">
                &nbsp; &nbsp;
                <Button className="btn btn-outline-dark" value="Login" />
                &nbsp;
                <Link to="/register" className="btn btn-outline-dark">
                  Register
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
