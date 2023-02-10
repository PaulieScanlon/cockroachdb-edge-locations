import React, { Fragment, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useFrame, useLoader } from '@react-three/fiber';
import { GradientTexture, Points, Point, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import * as random from 'maath/random/dist/maath-random.cjs';

import { GeoJsonGeometry } from 'three-geojson-geometry';
import { geoGraticule10 } from 'd3-geo';

import goeJson from './ne_110m_admin_0_countries.geojson.json';

const getVertex = (lat, lng, radius) => {
  const vector = new THREE.Vector3().setFromSpherical(
    new THREE.Spherical(radius, THREE.MathUtils.degToRad(90 - lat), THREE.MathUtils.degToRad(lng))
  );
  return vector;
};

const ThreeMesh = ({ isPlaying, locations }) => {
  const mesh = useRef(null);

  const [sphere] = useState(() => random.inSphere(new Float32Array(2000), { radius: 2 }));

  useFrame(() => {
    return !isPlaying ? null : (mesh.current.rotation.y += 0.004);
  });

  useEffect(() => {
    if (mesh) {
      mesh.current.rotation.x = 0.3;
    }
  }, []);

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[1, 32]} />
      <meshPhongMaterial color="#191919" transparent={true} opacity={0.6} />

      <Fragment>
        {goeJson.features.map((data, index) => {
          const { geometry } = data;
          return (
            <lineSegments key={index} geometry={new GeoJsonGeometry(geometry, 1)}>
              <lineBasicMaterial color="#5c5c5c" />
            </lineSegments>
          );
        })}
      </Fragment>

      <lineSegments geometry={new GeoJsonGeometry(geoGraticule10(), 1)}>
        <lineBasicMaterial color="#323232" />
      </lineSegments>

      <Points>
        <pointsMaterial vertexColors size={0.02} />
        {locations.map((data, index) => {
          const { lat, lng } = data;
          return <Point key={index} position={getVertex(lat, lng, 1.02)} color="#00ff33" />;
        })}
      </Points>

      <Points positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial transparent={true} color="#97907e" size={0.007} sizeAttenuation={true} depthWrite={false} />
      </Points>
    </mesh>
  );
};

ThreeMesh.propTypes = {
  /** Status of animation */
  isPlaying: PropTypes.bool.isRequired,
  /** The location data */
  locations: PropTypes.any.isRequired
};

export default ThreeMesh;
