import React, { useRef, useState } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./NewNote.css";
//import AWS Amplify to connect our API
import { API } from "aws-amplify";
import { s3Upload } from "../libs/awsLib";
import ImageInfo from '../libs/ImageInfo';

export default function NewNote(props) {
  const file = useRef(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return content.length > 0;
  }

  function handleFileChange(event) {
    console.log(event.target.files);

    file.current = event.target.files;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    try {
      // check image
      const f = file.current[0];
      await ImageInfo(f);

      const attachment = await s3Upload(f);
      await createNote({ content, attachment });

      props.history.push("/");

    } catch (e) {
      alert(e.message);
      setIsLoading(false);
    }

    // upload file using s3Upload method
    // try {
    //   const promiseList = [];
    //   for (let i = 0; i < file.current.length; i++) {
    //     promiseList.push(
    //       uploadfilePromise(file.current[i])
    //     );
    //   }
    //
    //   const result = await Promise.all(promiseList);
    //   console.log(result);
    //   props.history.push("/");
    // } catch (e) {
    //   alert(e);
    //   setIsLoading(false);
    // }
  }

  function createNote(note) {
    return API.post("notes", "/notes", {
      body: note
    });
  }

  function uploadfilePromise(file) {

    return s3Upload(file)
      .then(attachment => {
        return createNote({ content, attachment });
      })
  }

  // added multiple in FormControl
  return (
    <div className="NewNote">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="content">
          <FormControl
            value={content}
            componentClass="textarea"
            onChange={e => setContent(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="file">
          <ControlLabel>Attachment</ControlLabel>
          <FormControl onChange={handleFileChange} type="file" />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          bsStyle="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Create
        </LoaderButton>
      </form>
    </div>
  );
}
