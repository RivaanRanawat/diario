import "./App.css";
import Login from "./components/Login/Login.jsx";
import Signup from "./components/Signup/Signup.jsx";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { auth } from "./services/firebase";
import { useState, useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import Home from "./components/Home/Home";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Switch>
            <PrivateRoute exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
