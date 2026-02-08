// src/index.js
import { initSentry } from './config/sentry';
import './styles/global.css';
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

initSentry();

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
} else {

}
