import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from "react-router-dom";
import { useAuth } from "../../context/auth";
import './index.css';


import {login} from '../../features/user_slice';

export const Login = (props) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  // if (this.props.isLoggedIn) {
  //     return <Redirect to='/'/>;
  // }

  

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(login({
      userName,
      password,
      loggedIn: true
    }))
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <h1>Login Here</h1>
      <input 
      type="name" 
      placeholder="Name" 
      value={userName} 
      onChange={(e) => {
        setUserName(e.target.value);
      }}/>
      <input 
      type="password" 
      placeholder="Password" 
      value={password} 
      onChange={(e) => {
        setPassword(e.target.value);
      }}/>
      <button type="submit">Sign In</button>
    </form>
  );
}