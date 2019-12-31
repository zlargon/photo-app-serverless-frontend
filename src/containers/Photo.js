import { Auth, API, Storage } from 'aws-amplify';
import React, { useState, useEffect } from 'react';
import { FormGroup, ControlLabel, PageHeader } from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import './Photo.scss';

export default function Photo(props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [image, setImage] = useState({});
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function onLoad() {
      try {
        const user = await Auth.currentAuthenticatedUser();
        setUser(user.attributes);

        const file = await API.get('photos', `/photos/${props.match.params.id}`);
        file.url = await Storage.vault.get(file.attachment);
        setImage(file);
      } catch (e) {
        alert(e);
      }
    }

    onLoad();
  }, [props.match.params.id]);

  // HANDLE DELETE FUNCTION
  // https://aws.github.io/aws-amplify/api/classes/storageclass.html#remove to remove file
  function deletePhoto() {
    return API.del('photos', `/photos/${props.match.params.id}`);
  }

  const handleDelete = async (event) => {
    event.preventDefault();

    const confirmed = window.confirm(
      'Are you sure you want to delete this photo?'
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deletePhoto();
      props.history.push('/');
    } catch (e) {
      alert(e);
      setIsDeleting(false);
    }
  }

  return (
    <div className="photo">
      <div>{user && user.name}</div>
      <PageHeader>{image.content}</PageHeader>
      <form>
        <ControlLabel>Uploaded At: {new Date(image.createdAt).toLocaleString()}</ControlLabel>
        <FormGroup className="image">
          <img src={image.url} alt=""/>
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          bsStyle="danger"
          onClick={handleDelete}
          isLoading={isDeleting}
        >
          Delete
        </LoaderButton>
      </form>
    </div>
  );
}
