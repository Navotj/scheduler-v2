// src/components/BannerImageCropper.js

import React, { useState } from 'react';
import Cropper from 'react-easy-crop';

const BannerImageCropper = ({ bannerImage, setBannerImage, setCroppedImage }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropArea, setCropArea] = useState(null);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCropArea(croppedAreaPixels);
  };

  const handleSaveCrop = () => {
    if (!cropArea || !bannerImage) return;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const image = new Image();
    image.src = bannerImage;
    image.onload = () => {
      const aspectRatio = 5 / 2;
      const newWidth = 300; // Compress to 300 pixels wide
      const newHeight = newWidth / aspectRatio;
      canvas.width = newWidth;
      canvas.height = newHeight;
      context.drawImage(
        image,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
      const base64Image = canvas.toDataURL('image/jpeg'); // Convert to Base64 string
      setCroppedImage(base64Image);
      setBannerImage(null); // Hide cropper after cropping
    };
  };

  const handleCancelCrop = () => {
    setBannerImage(null); // Reset the banner image if canceled
  };

  return (
    <div className="cropper-container">
      <div className="cropper-wrapper">
        <Cropper
          image={bannerImage}
          crop={crop}
          zoom={zoom}
          aspect={3 / 1} // 3:1 aspect ratio
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>
      <div className="cropper-buttons">
        <button onClick={handleSaveCrop}>Save</button>
        <button onClick={handleCancelCrop}>Cancel</button>
      </div>
    </div>
  );
};

export default BannerImageCropper;
