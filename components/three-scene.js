import React from 'react';
import PropTypes from 'prop-types';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import ThreeMesh from '../components/three-mesh';

const ThreeScene = ({ isPlaying, locations, serverlessRegion }) => {
  return (
    <Canvas
      camera={{
        fov: 75,
        position: [0, 0, 2.1]
      }}
    >
      <OrbitControls enableRotate={true} enableZoom={true} enablePan={true} maxDistance={3} minDistance={0.2} />
      <ambientLight intensity={1.3} />
      <pointLight position={[-10, -10, -10]} intensity={0.4} />
      <ThreeMesh locations={locations} isPlaying={isPlaying} serverlessRegion={serverlessRegion} />
    </Canvas>
  );
};

ThreeScene.propTypes = {
  /** Status of animation */
  isPlaying: PropTypes.bool.isRequired,
  /** The location data */
  locations: PropTypes.any.isRequired,
  /** The location the Serverless Function is running */
  serverlessRegion: PropTypes.string.isRequired
};

export default ThreeScene;
