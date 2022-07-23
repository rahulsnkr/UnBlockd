import * as tf from '@tensorflow/tfjs';
import React from 'react';
import {loadGraphModel} from '@tensorflow/tfjs-converter';
import {useState} from 'react';
import {Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import {SyncLoader} from 'react-spinners';

export const Inference = ({
  state,
}) => {
  const [score, setScore] = useState();
  const [loading, setLoading] = useState(false);
  const loadModel = async () => {
    const url = process.env.PUBLIC_URL + '/tfjs_graph/model.json';
    return await loadGraphModel(url);
  };

  const modelTest = async () => {
    const faceTensor1 =
      tf.tensor(
          state.faceImg1.data32F,
          [state.faceImg1.rows, state.faceImg1.cols, 3],
      );
    const signTensor1 =
      tf.tensor(
          state.signImg1.data32F,
          [state.signImg1.rows, state.signImg1.cols, 1],
      );
    const faceSignTensor1 = tf.concat([faceTensor1, signTensor1], 2);

    const faceTensor2 =
      tf.tensor(
          state.faceImg2.data32F,
          [state.faceImg2.rows, state.faceImg2.cols, 3],
      );
    const signTensor2 =
      tf.tensor(
          state.signImg2.data32F,
          [state.signImg2.rows, state.signImg2.cols, 1],
      );
    const faceSignTensor2 = tf.concat([faceTensor2, signTensor2], 2);

    loadModel().then((model) => {
      const simScore = model.predict(
          [faceSignTensor1.expandDims(0),
            faceSignTensor2.expandDims(0)]).dataSync();
      setScore(simScore*100);
      setLoading(false);
    });
  };

  return (
    <div>

      <Button onClick={() => {
        setLoading(true);
        modelTest();
      }} disabled={loading}> Test Model </Button>
      <SyncLoader loading={loading}/>
      {!loading && score && <h4>Similarity Score: {score}%</h4>}
      {
        !loading &&
        score > 50 &&
        <div style={{fontSize: '20px', color: 'green'}}>Access Granted!</div>
      }
      {
        !loading &&
        score < 50 &&
        <div style={{fontSize: '20px', color: 'red'}}>Access Denied!</div>
      }
    </div>
  );
};
