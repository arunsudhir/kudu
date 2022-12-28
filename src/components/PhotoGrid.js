import React from 'react';

function PhotoGrid(props) {
  const { photos } = props;

  return (
    <div className="photo-grid">
      {photos.map(photo => (
        <div key={photo.id} className="photo">
          <img src={photo.url} alt={photo.description} />
          <p>{photo.description}</p>
        </div>
      ))}
    </div>
  );
}

export default PhotoGrid;