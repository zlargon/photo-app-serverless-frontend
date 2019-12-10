import { API, Storage } from "aws-amplify";
import React, { useState, useEffect } from "react";
import { PageHeader } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./Home.css";
import "./Photos.scss";

export default function Photos(props) {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // load photos
  useEffect(() => {
    const onLoad = async () => {
      if (!props.isAuthenticated) {
        return;
      }

      try {
        const photos = await API.get('notes', '/notes');
        const urls = await Promise.all(
          photos.map(note => Storage.vault.get(note.attachment))
        );
        for (const i in photos) {
          photos[i].url = urls[i];
        }

        setPhotos(photos);
      } catch (e) {
        alert(e);
      }

      setIsLoading(false);
    };

    onLoad();
  }, [props.isAuthenticated]);

  const render = (photos) => {
    return (
      <div className="list">
        { photos.map(photo => {
          return (
            <LinkContainer className="image" key={photo.noteID} to={`/notes/${photo.noteID}`}>
              <img src={photo.url} />
            </LinkContainer>
          )
        }) }
      </div>
    )
  }

  return (
    <div className="photos">
      { !props.isAuthenticated ?
          // 1. welcome
          <div className="lander">
            <h1>ITC-6480 - We Hate Servers</h1>
            <p>File Upload Front End</p>
          </div>
        :
          // 2. photos
          <div>
            <PageHeader>Photos</PageHeader>
            <LinkContainer className="upload" to="/upload">
              <h4>{"\uFF0B"} Upload a new photo</h4>
            </LinkContainer>
            {!isLoading && render(photos)}
          </div>
      }
    </div>
  );
}
