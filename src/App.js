// updating this to store the login state: import React from "react";
import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import "./App.css";
import Routes from "./Routes";
import { LinkContainer } from "react-router-bootstrap";
import { Auth } from "aws-amplify";

// our function
function App(props) {
  // state variable that makes login info persist, start app by checking current authentication state
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  // initializes the isAuthinticated state variable to false
  // calling userHasAuthenticated updates the state
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  // load user session
  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }

    setIsAuthenticating(false);
  }

  // clears out login session from the browser
  async function handleLogout() {
    await Auth.signOut();

    userHasAuthenticated(false);
    // redirect to login after logout
    props.history.push("/login");

  }

  return (
    !isAuthenticating && (
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">ITC 6480 - We Hate Servers</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {isAuthenticated ? <NavItem onClick={handleLogout}>Logout</NavItem> : (
                <>
                  <LinkContainer to="/signup">
                    <NavItem>Signup</NavItem>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <NavItem>Login</NavItem>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes appProps={{ isAuthenticated, userHasAuthenticated }} />
      </div>
    )
  );
}

//redirect to login after logout
export default withRouter(App);
