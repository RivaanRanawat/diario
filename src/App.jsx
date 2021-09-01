import "./App.css";
import Login from "./components/Login/Login.jsx";
import Signup from "./components/Signup/Signup.jsx";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./components/Home/Home";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import TextEditor from "./components/Home/TextEditor/TextEditor";
import CreateNewDiary from "./components/CreateNew/CreateNewDiary";
import ChaptersTable from "./components/Home/ChaptersTable/ChaptersTable";
import CreateNewChapter from "./components/CreateNew/CreateNewChapter";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Switch>
            <PrivateRoute exact path="/" component={Home} />
            <PrivateRoute exact path="/create-new-diary" component={CreateNewDiary} />
            <PrivateRoute exact path="/create-new-chapter/:slug" component={CreateNewChapter} />
            <PrivateRoute exact path="/text-editor/:diary/:chapter" component={TextEditor} />
            <PrivateRoute exact path="/chapters/:slug" component={ChaptersTable} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
