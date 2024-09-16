// src/components/BannerUpload.js

import React from 'react';

const BannerUpload = ({ handleBannerUpload, croppedImage }) => {
  return (
    <>
      <div className="unified-container">
        <input
          type="file"
          accept="image/*"
          onChange={handleBannerUpload}
          className="banner-upload"
        />
      </div>
      {croppedImage && (
        <div className="banner-image-container">
          <img src={croppedImage} alt="Cropped Banner" className="banner-image" />
        </div>
      )}
    </>
  );
};

export default BannerUpload;
