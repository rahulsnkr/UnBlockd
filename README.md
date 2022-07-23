# UnBlockd

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

This project aims to implement a multimodal biometric security system that uses face and signature images to grant access, along with decentralized secure onboarding.
The two sections of this project are-
 - **Onboarding**: Users can onboard by uploading an image of their face and signature. These images are then encrypted and uploaded to IPFS, and their corresponding hashes are stored on the blockchain along with the user's SSN.
 - **Access Control**: An admin can retrieve the user's images from the blockchain by specifying the user's SSN. To grant access, the user must provide a face and signature image, which would be compared with the images they provided during onboarding. A multimodal siamese network is used for this process, the details of which can be found in [this repo](https://github.com/rahulsnkr/multimodal-siamese-neural-network).
 
## Key Features
  - **AES Encryption**: All images are encrypted with public key cryptography before storage, and are decrypted after retrieval. Everything is done on the client's machine.
  - **Decentralized storage**: Since images are stored in a decentralized manner, there is no need to trust a central entity with sensitive data.
  - **Deep Learning Security System**: Due to the deep learning based approach opted for this, the client can choose to upload a different set of images than the one they used for onboarding
  - **Data Locality**: The client's data never leaves the machine for access control. The security system runs entirely in the browser.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

Sample images are present in `src/sample_imgs` for testing

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!
