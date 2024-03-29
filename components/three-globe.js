import React, { useState, useEffect, useRef, memo } from 'react';
import PropTypes from 'prop-types';

import Globe from 'react-globe.gl';
import * as THREE from 'three';
import { getDistance } from 'geolib';

import goeJson from './ne_110m_admin_0_countries.geojson.json';

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : null;
};

const getComputedColor = (cssVariableName) => {
  return getComputedStyle(document.documentElement).getPropertyValue(cssVariableName).replace(' ', '');
};

const ThreeGlobe = ({ isPlaying, hasCurrent, points, route, rings }) => {
  const globeEl = useRef();

  const [stars, _] = useState(
    [...Array(500).keys()].map(() => ({
      lat: (Math.random() - 0.5) * 180,
      lng: (Math.random() - 0.5) * 360,
      alt: Math.random() * 1.4 + 0.1
    }))
  );

  const pointsData = points.filter(Boolean).reduce((items, item) => {
    const { radius, altitude, colors, data } = item;

    return [
      ...items,
      ...data.map((d) => {
        const { latitude, longitude } = d;
        return {
          lat: latitude,
          lng: longitude,
          color: getComputedColor(colors[0]),
          radius: radius,
          altitude: altitude
        };
      })
    ];
  }, []);

  const ringsData = rings.filter(Boolean).reduce((items, item) => {
    const { colors, data } = item;

    return [
      ...items,
      ...data.map((d) => {
        const { latitude, longitude } = d;
        return {
          lat: latitude,
          lng: longitude,
          color: hexToRgb(getComputedColor(colors[0])),
          maxR: 20,
          propagationSpeed: 4,
          repeatPeriod: 800
        };
      })
    ];
  }, []);

  const routesData = route.filter(Boolean).reduce((items, item, index) => {
    const { type, data } = item;
    const isCurrent = index === 0;

    items.push(
      ...data.map(() => {
        return {
          type: type,
          startLat: isCurrent ? route[0].data[0].latitude : route[1].data[0].latitude,
          startLng: isCurrent ? route[0].data[0].longitude : route[1].data[0].longitude,
          endLat: isCurrent ? route[1].data[0].latitude : route[2].data[0].latitude,
          endLng: isCurrent ? route[1].data[0].longitude : route[2].data[0].longitude,
          color: isCurrent
            ? [getComputedColor(route[0].colors[0]), getComputedColor(route[1].colors[0])]
            : [getComputedColor(route[1].colors[0]), getComputedColor(route[2].colors[0])]
        };
      })
    );

    return items;
  }, []);

  const markerData = route.filter(Boolean).reduce((items, item) => {
    const { data } = item;
    return [
      ...items,
      ...data.map((d) => {
        const { latitude, longitude } = d;
        return {
          lat: latitude,
          lng: longitude
        };
      })
    ];
  }, []);

  const distances = routesData
    .reduce((items, item) => {
      const { startLat, startLng } = item;

      return [
        ...items,
        {
          latitude: startLat,
          longitude: startLng
        }
      ];
    }, [])
    .map((d) => {
      return d;
    })
    .slice(0, -1);

  // hard coded for now, these are the locations for the serverless clusters
  const clustersData = [
    {
      type: 'cluster',
      startLat: 50.10967976447574,
      startLng: 8.68942905774188,
      endLat: 37.25633550865467,
      endLng: -79.09898275762913,
      color: getComputedColor('--color-cluster')
    },
    {
      type: 'cluster',
      startLat: 37.25633550865467,
      startLng: -79.09898275762913,
      endLat: 43.80433182823407,
      endLng: -121.02829983691751,
      color: getComputedColor('--color-cluster')
    }
  ];

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
    <div className="flex items-start sm:items-center justify-center h-full">
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
            new THREE.SphereGeometry(0.3),
            new THREE.MeshBasicMaterial({ color: '#97907e', opacity: 0.6, transparent: true })
          )
        }
        customThreeObjectUpdate={(obj, d) => {
          Object.assign(obj.position, globeEl.current?.getCoords(d.lat, d.lng, d.alt));
        }}
        arcsData={hasCurrent ? [...routesData, ...clustersData] : []}
        arcColor={'color'}
        arcDashLength={(arc) => {
          return arc.type === 'cluster' ? 0.05 : 0.5;
        }}
        arcAltitudeAutoScale={0.4}
        arcStroke={(arc) => {
          return arc.type === 'cluster' ? 0.1 : 0.5;
        }}
        arcDashGap={() => 0.1}
        arcDashAnimateTime={() => (isPlaying ? 2000 : 0)}
        ringsData={hasCurrent ? ringsData : []}
        ringColor={(ring) => (t) => {
          return `rgba(${ring.color}, ${Math.sqrt(1 - t)})`;
        }}
        ringMaxRadius="maxR"
        ringPropagationSpeed="propagationSpeed"
        ringRepeatPeriod={isPlaying ? 'repeatPeriod' : 0}
        ringResolution={64}
        htmlElementsData={hasCurrent ? [markerData[0]] : []}
        htmlAltitude={0.2}
        htmlElement={() => {
          const el = document.createElement('div');
          const meters = hasCurrent ? getDistance(...distances) : 0;
          const miles = meters * 0.000621371192;
          const kilometers = meters / 1000;

          el.innerHTML = `<div class='flex flex-col gap-2 text-primary text-sm px-4 py-2 bg-surface/80 border border-border rounded mt-24 mr-48'>
                            <div class='flex flex-col gap-3'>
                              <div class='flex flex-col gap-1'>
                                <small class='text-current'>→ One Way</small>
                                <span class='block'>
                                  ~<strong>${miles.toLocaleString()}</strong>
                                  <small>miles</small>
                                </span>      
                                <span class='block'>
                                  ~<strong>${kilometers.toLocaleString()}</strong>
                                  <small>km</small>
                                </span>
                              </div>
                              <div class='flex flex-col gap-1'>
                                <small class='text-current'>↔ Round Trip</small>
                                <span class='block'>
                                  ~<strong>${(miles * 2).toLocaleString()}</strong>
                                  <small>miles</small>
                                </span>      
                                <span class='block'>
                                  ~<strong>${(kilometers * 2).toLocaleString()}</strong>
                                  <small>km</small>
                                </span>
                              </div>
                            </div>
                          </div>`;
          return el;
        }}
      />
    </div>
  );
};

ThreeGlobe.propTypes = {
  /** Status of animation */
  isPlaying: PropTypes.bool.isRequired,
  /** has current location data  */
  hasCurrent: PropTypes.bool.isRequired,
  /** The locations, clusters and functions */
  points: PropTypes.any.isRequired,
  /** The route of the data: current position, current server/lambda, nearest database */
  routes: PropTypes.any,
  /** The location of where to add rings */
  rings: PropTypes.any
};

export default memo(ThreeGlobe);
