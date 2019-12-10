import { API, Storage } from 'aws-amplify';
import React, { useState, useEffect } from 'react';
import { FormGroup, PageHeader } from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import './Photo.scss';

export default function Notes(props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [image, setImage] = useState({});

  useEffect(() => {
    async function onLoad() {
      try {
        const file = await API.get('notes', `/notes/${props.match.params.id}`);
        file.url = await Storage.vault.get(file.attachment);
        setImage(file);
      } catch (e) {
        alert(e);
      }
    }

    onLoad();
  }, [props.match.params.id]);

  // HANDLE DELETE FUNCTION
  // NOTE NOT DELETING FILE JUST ATTACHED NOTED
  // https://aws.github.io/aws-amplify/api/classes/storageclass.html#remove to remove file
  function deleteNote() {
    return API.del('notes', `/notes/${props.match.params.id}`);
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
      await deleteNote();
      props.history.push('/');
    } catch (e) {
      alert(e);
      setIsDeleting(false);
    }
  }

  return (
    <div className="photo">
      <PageHeader>{image.content}</PageHeader>
      <form>
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
