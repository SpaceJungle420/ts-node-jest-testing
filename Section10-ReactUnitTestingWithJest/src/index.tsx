import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import App2 from "./App2";
import LoginComponent from "./LoginComponent";
import LoginService from "./services/LoginService";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const loginService = new LoginService();
const setToken = (token: string) => {
  console.log(`recieved the token ${token}`);
};

root.render(<LoginComponent loginService={loginService} setToken={setToken} />);
