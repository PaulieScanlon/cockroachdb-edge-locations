import React from 'react';

const ThreeSphere = () => {
  return (
    <mesh>
      <sphereGeometry args={[1, 32]} />
      <meshStandardMaterial color="#ffffff" transparent={true} opacity={0.1} />
    </mesh>
  );
};

export default ThreeSphere;
