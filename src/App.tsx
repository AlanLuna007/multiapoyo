import { Component } from "react";
import { Switch, Route, Link, BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Login } from "./components/login.component";
import { Register } from "./components/register.component";
import { Profile } from "./components/profile.component";
import { TodoProvider } from "./context/TodoProvider";
import 'antd/dist/antd.css';
type Props = {};

class App extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <TodoProvider>
      <BrowserRouter>
      <div>

        <div>
          <Switch>
            <Route exact path={["/", "/login"]} component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/profile" component={Profile} />
          </Switch>
        </div>

      </div>
      </BrowserRouter>
      </TodoProvider>
    );
  }
}

export default App;
