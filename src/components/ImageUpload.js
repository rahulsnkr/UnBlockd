import {useEffect, useState} from 'react';
import React from 'react';
import cv from 'opencv.js';
import 'bootstrap/dist/css/bootstrap.css';

export const ImageUpload = ({
  setFace,
  setSign,
  mode,
}) => {
  const [selectedFiles, setSelectedFiles] = useState();
  const [facePreview, setFacePreview] = useState();
  const [signPreview, setSignPreview] = useState();

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFiles) {
      setFacePreview(undefined);
      setSignPreview(undefined);
      return;
    }

    const objectFaceUrl = URL.createObjectURL(selectedFiles[0]);
    setFacePreview(objectFaceUrl);

    const objectSignUrl = URL.createObjectURL(selectedFiles[1]);
    setSignPreview(objectSignUrl);

    // free memory when ever this component is unmounted
    return () => {
      URL.revokeObjectURL(objectFaceUrl);
      URL.revokeObjectURL(objectSignUrl);
    };
  }, [selectedFiles]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFiles(undefined);
      return;
    }

    setSelectedFiles(e.target.files);
  };

  const processFaceImg = () => {
    const imgElement = document.getElementById('faceImg'+mode);
    const img = cv.imread(imgElement);
    const bgrImg = new cv.Mat();
    const normImg = new cv.Mat();
    const resizeImg = new cv.Mat();
    cv.cvtColor(img, bgrImg, cv.COLOR_RGBA2BGR, 0);
    cv.normalize(bgrImg, normImg, 0, 1, cv.NORM_MINMAX, cv.CV_32F);
    cv.resize(normImg, resizeImg, new cv.Size(128, 128));
    setFace(mode, resizeImg);
  };

  const processSignImg = () => {
    const imgElement = document.getElementById('signImg'+mode);
    const img = cv.imread(imgElement);
    const grayImg = new cv.Mat();
    const normImg = new cv.Mat();
    const resizeImg = new cv.Mat();
    cv.cvtColor(img, grayImg, cv.COLOR_RGBA2GRAY, 0);
    cv.normalize(grayImg, normImg, 0, 1, cv.NORM_MINMAX, cv.CV_32F);
    cv.resize(normImg, resizeImg, new cv.Size(128, 128));
    setSign(mode, resizeImg);
  };


  return (
    <div>
      <h5>Select a face image, followed by a sign image</h5>
      <input type='file' onChange={onSelectFile} multiple/>
      {
        selectedFiles &&
        <img
          src={facePreview}
          id={'faceImg'+mode}
          onLoad={processFaceImg}
          hidden
        />
      }
      {
        selectedFiles &&
        <img
          src={signPreview}
          id={'signImg'+mode}
          onLoad={processSignImg}
          hidden
        />
      }

      {selectedFiles && <img src={facePreview} width="10%" height="10%"/> }
      {selectedFiles && <img src={signPreview} width="10%" height="10%"/> }
    </div>
  );
};
