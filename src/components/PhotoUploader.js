import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { upload } from '@testing-library/user-event/dist/upload';
import '../css/upload.css';
import '../css/progress-bar.css';

function PhotoUploader(props) {
  const { storage } = props;
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imgUrl, setImgUrl] = useState(null);

  const handleChange = event => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = event => {
    event.preventDefault();

    setUploading(true);

    // Upload the file to Cloud Storage
    const storageRef = ref(storage, `photos/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on("state_changed",
      (snapshot) => {
        const progress =
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(progress);
        console.log(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgUrl(downloadURL)
          setUploading(false);
          console.log("Ssdfsd")
        });
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleChange} />
      <button type="submit" className="upload-button" disabled={uploading}>
        Upload
      </button>
      {uploading && <div className="progress-bar"></div>}
    </form>
  );
}

export default PhotoUploader;
