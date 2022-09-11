import React from 'react';
import PropTypes from 'prop-types';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import ThreeMesh from '../components/three-mesh';

const ThreeScene = ({ locations }) => {
  return (
    <Canvas
      camera={{
        fov: 75,
        position: [0, 0, 2.1]
      }}
    >
      <OrbitControls enableRotate={true} enableZoom={false} enablePan={false} />
      <ambientLight intensity={1.3} />
      <pointLight position={[-10, -10, -10]} intensity={0.4} />
      <ThreeMesh locations={locations} />
    </Canvas>
  );
};

ThreeScene.propTypes = {
  /** The location data */
  locations: PropTypes.any.isRequired
};

export default ThreeScene;
