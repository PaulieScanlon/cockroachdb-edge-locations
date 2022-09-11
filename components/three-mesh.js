import React, { Fragment, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useFrame, useLoader } from '@react-three/fiber';
import { GradientTexture, Points, Point } from '@react-three/drei';
import * as THREE from 'three';

import { GeoJsonGeometry } from 'three-geojson-geometry';
import { geoGraticule10 } from 'd3-geo';

import goeJson from './ne_110m_admin_0_countries.geojson.json';

const getVertex = (lat, lng, radius) => {
  const vector = new THREE.Vector3().setFromSpherical(new THREE.Spherical(radius, THREE.MathUtils.degToRad(90 - lat), THREE.MathUtils.degToRad(lng)));
  return vector;
};

const ThreeMesh = ({ locations }) => {
  const mesh = useRef(null);

  useFrame(() => {
    return (mesh.current.rotation.y += 0.004);
  });

  useEffect(() => {
    if (mesh) {
      mesh.current.rotation.x = 0.3;
    }
  }, []);

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[1, 32]} />
      <meshStandardMaterial color="#191919" transparent={true} opacity={0.4} />

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
        <lineBasicMaterial color="#3d3d3d" />
      </lineSegments>

      <Points>
        <pointsMaterial vertexColors size={0.03} />

        {locations.map((data, index) => {
          const { lat, lng } = data;
          return <Point key={index} position={getVertex(lat, lng, 1)} color="#00ff33" />;
        })}
      </Points>
    </mesh>
  );
};

ThreeMesh.propTypes = {
  /** The location data */
  locations: PropTypes.any.isRequired
};

export default ThreeMesh;
