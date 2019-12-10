import { API, Storage } from 'aws-amplify';
import ImageInfo from '../libs/ImageInfo';

import React, { useState } from 'react';
import {
  PageHeader,
  ListGroup,
  ListGroupItem,
  FormGroup,
  FormControl,
  Glyphicon
} from "react-bootstrap";
import LoaderButton from '../components/LoaderButton';
import './UploadPhoto.scss';

export default function UploadPhoto(props) {
  const [fileInfo, setFileInfo] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    try {
      await Promise.all(
        fileInfo.map(uploadOneFile)
      );
      props.history.push("/");
    } catch (e) {
      alert(e.message);
      setIsLoading(false);
    }
  }

  const uploadOneFile = async (file) => {
    // 1. upload to s3
    const stored = await Storage.vault.put(
      `${Date.now()}-${file.name}`,   // file name
      file.file,                      // file object
      { contentType: file.type }
    );

    // 2. update dynamodb
    return await API.post("notes", "/notes", {
      body: {
        content: file.name,
        attachment: stored.key
      }
    });
  }

  const onFileChanged = async (event) => {
    setIsChecking(true);
    const fileInfo = [];

    // validate the files
    let valid = event.target.files.length !== 0;
    for (const file of event.target.files) {
      try {
        const image = await ImageInfo(file);
        fileInfo.push({
          valid: true,
          ...image
        });
      } catch (e) {
        fileInfo.push({
          valid: false,
          name: file.name,
          error: e.message
        });
        valid = false;
      }
    }

    setFileInfo(fileInfo);
    setIsValid(valid);
    setIsChecking(false);
  }

  const createListItem = (file) => {
    return (
      !file.valid ?
        <ListGroupItem key={file.name} header={file.name} style={{color: 'red'}}>
          {file.error}
        </ListGroupItem>
      :
        <ListGroupItem key={file.name} header={file.name}>
          {file.name} ({file.type}) ({file.width}x{file.height}) {Math.round(file.size / 10000)/100} MB
        </ListGroupItem>
    );
  }

  return (
    <div className="upload-photo">
      <PageHeader>
        Upload Photo
        {isChecking && <Glyphicon glyph="refresh" className="spinning" />}
      </PageHeader>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <FormControl
            multiple
            type="file"
            onChange={onFileChanged}
          />
          <br/>
          <LoaderButton
            block
            type="submit"
            bsSize="large"
            bsStyle="primary"
            isLoading={isLoading}
            disabled={!isValid}
          >
            {!isValid ? 'No Ready to Upload' : 'Upload Photos' }
          </LoaderButton>
          <br/>
          <ListGroup>
            { fileInfo.map(createListItem) }
          </ListGroup>
        </FormGroup>
      </form>
    </div>
  );
}
