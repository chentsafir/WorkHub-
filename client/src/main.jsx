import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import store from "./redux/store";

import "./index.css";

/* 
  Entry point of the React application.
  - Wraps the entire app with Redux Provider to give access to the store.
  - Wraps with React.StrictMode for highlighting potential problems in development.
  - Wraps with BrowserRouter to enable client-side routing.
  - Renders the main App component into the root DOM element.
*/
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </Provider>
);
