import React, { useState, useEffect, useRef, memo } from 'react';
import PropTypes from 'prop-types';

import Globe from 'react-globe.gl';
import * as THREE from 'three';
import goeJson from './ne_110m_admin_0_countries.geojson.json';

const ThreeGlobe = ({ isPlaying, hasCurrent, data }) => {
  const globeEl = useRef();

  const [stars, _] = useState(
    [...Array(300).keys()].map(() => ({
      lat: (Math.random() - 0.5) * 180,
      lng: (Math.random() - 0.5) * 360,
      alt: Math.random() * 1.4 + 0.1
    }))
  );

  const pointsData = data.filter(Boolean).reduce((items, item) => {
    const { radius, altitude, colors, data } = item;

    return [
      ...items,
      ...data.map((d) => {
        const { latitude, longitude } = d;
        return {
          lat: latitude,
          lng: longitude,
          color: colors[Math.floor(Math.random() * colors.length)],
          radius: radius,
          altitude: altitude
        };
      })
    ];
  }, []);

  const ringsData = data.filter(Boolean).reduce((items, item) => {
    const { type, colors, data } = item;

    if (type === 'function') {
      items.push(
        ...data.map((d) => {
          const { latitude, longitude } = d;
          return {
            lat: latitude,
            lng: longitude,
            color: colors[Math.floor(Math.random() * colors.length)],
            maxR: 20,
            propagationSpeed: 4,
            repeatPeriod: 800
          };
        })
      );
    }

    return items;
  }, []);

  const ringsInterpolator = (t) => `rgba(255,0,0,${Math.sqrt(1 - t)})`;

  const arcsData = data.filter(Boolean).reduce((items, item) => {
    const { type, colors, data } = item;

    if (type === 'cluster' || type === 'current') {
      items.push(
        ...data.map((d) => {
          const { latitude, longitude } = d;

          const isCurrent = type === 'current';

          return {
            startLat: isCurrent ? latitude : ringsData[0].lat,
            startLng: isCurrent ? longitude : ringsData[0].lng,
            endLat: isCurrent ? ringsData[0].lat : latitude,
            endLng: isCurrent ? ringsData[0].lng : longitude,
            color: isCurrent
              ? [colors[Math.floor(Math.random() * colors.length)], ringsData[0].color]
              : [ringsData[0].color, colors[Math.floor(Math.random() * colors.length)]]
          };
        })
      );
    }

    return items;
  }, []);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = isPlaying;
    }
  }, [isPlaying]);

  const globeReady = () => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = isPlaying;
      globeEl.current.controls().minDistance = globeEl.current.getGlobeRadius() * 2;
      globeEl.current.controls().maxDistance = globeEl.current.getGlobeRadius() * 4;

      // tilt the Glob slightly, point it at Algeria
      globeEl.current.pointOfView({ lat: 28.102363277955938, lng: 2.6993398129629016, altitude: 1.8 });
    }
  };

  return (
    <div className="flex justify-center">
      <Globe
        ref={globeEl}
        onGlobeReady={globeReady}
        rendererConfig={{ antialias: true, alpha: true }}
        animateIn={false}
        width={1280}
        backgroundColor={'rgba(255, 255, 255, 0)'}
        showGraticules={true}
        globeMaterial={
          new THREE.MeshPhongMaterial({
            color: '#191919',
            opacity: 0.6,
            transparent: true
          })
        }
        atmosphereColor="#5a5243"
        pointsData={pointsData}
        pointColor="color"
        pointsMerge={true}
        pointAltitude="altitude"
        pointRadius="radius"
        hexPolygonsData={goeJson.features}
        hexPolygonResolution={3}
        hexPolygonMargin={0.4}
        hexPolygonColor={(geometry) => {
          return ['#35322b', '#22201b', '#47443a', '#5a5449'][geometry.properties.abbrev_len % 4];
        }}
        customLayerData={stars}
        customThreeObject={() =>
          new THREE.Mesh(
            new THREE.SphereGeometry(0.5),
            new THREE.MeshBasicMaterial({ color: '#97907e', opacity: 0.6, transparent: true })
          )
        }
        customThreeObjectUpdate={(obj, d) => {
          Object.assign(obj.position, globeEl.current?.getCoords(d.lat, d.lng, d.alt));
        }}
        arcsData={hasCurrent ? arcsData : []}
        arcColor={'color'}
        arcDashLength={() => 0.5}
        arcAltitudeAutoScale={0.4}
        arcStroke={0.4}
        arcDashGap={() => 0.1}
        arcDashAnimateTime={() => (isPlaying ? 2000 : 0)}
        ringsData={hasCurrent ? ringsData : []}
        ringColor={() => ringsInterpolator}
        ringMaxRadius="maxR"
        ringPropagationSpeed="propagationSpeed"
        ringRepeatPeriod={isPlaying ? 'repeatPeriod' : 0}
        ringResolution={64}
      />
    </div>
  );
};

ThreeGlobe.propTypes = {
  /** Status of animation */
  isPlaying: PropTypes.bool.isRequired,
  /** has current location data  */
  hasCurrent: PropTypes.bool.isRequired,
  /** The  locations, clusters and functions */
  data: PropTypes.any.isRequired
};

export default memo(ThreeGlobe);
