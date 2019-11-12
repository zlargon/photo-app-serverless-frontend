import React, { useState } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Login.css";
//added
import { Auth } from "aws-amplify";
import { useFormFields } from "../libs/hooksLib";

export default function Login(props) {
 
  // loading flag to give feedback when logging in
  const [isLoading, setIsLoading] = useState(false);
  //using custom hook from hooksLib
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: ""
  });

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }
//on submit do this - this is the login code!
//get email and password
//call amplify using Auth.signIn() method
//await keyworkd to envoke Auth.signIn()
  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);
  
    try {
      await Auth.signIn(fields.email, fields.password);
      props.userHasAuthenticated(true);
      //redirect to homepage after login!
      //props.history.push("/");
    } catch (e) {
      alert(e.message);
      setIsLoading(false);
    }
  }

  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="email" bsSize="large">
          <ControlLabel>Email</ControlLabel>
          <FormControl
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <ControlLabel>Password</ControlLabel>
          <FormControl
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Login
        </LoaderButton>
      </form>
    </div>
  );
}