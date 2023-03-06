import React, { Fragment, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
import { fromProvider } from 'cloud-regions-country-flags';

import Logo from '../components/logo';
import Spinner from '../components/spinner';
import Empty from '../components/empty';
import Loading from '../components/loading';
import Error from '../components/error';

const AWS = 'AWS Lambda';
const VERCEL = 'Vercel';

const ThreeGlobe = dynamic(() => import('../components/three-globe'), {
  ssr: false
});

import usePrefersReducedMotion from '../hooks/use-prefers-reduced-motion';

const lambda = [
  fromProvider('eu-central-1', 'AWS'),
  fromProvider('us-east-1', 'AWS'),
  fromProvider('us-west-1', 'AWS')
];

const Page = ({ data }) => {
  const queryClient = useQueryClient();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [functionProvider, setFunctionProvider] = useState(AWS);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  }, [prefersReducedMotion]);

  const queries = useQueries({
    queries: [
      {
        queryKey: ['read-query'],
        queryFn: async () => {
          try {
            // This API route uses the database connection string defined in .local env vars
            // const response = await fetch('/api/read', {
            //   method: 'GET'
            // });

            // This API uses prod env vars defined in the Serverless Repo / AWS Config
            const response = await fetch('https://api.crl-devrel.net/read', {
              method: 'GET'
            });

            if (!response.ok) {
              throw new Error();
            }

            const json = await response.json();

            const filtered = json.data.locations
              .sort((a, b) => b.id - a.id)
              .reduce((items, item) => {
                const city = items.find((obj) => obj.city === item.city);
                if (!city) {
                  return items.concat([item]);
                } else {
                  return items;
                }
              }, []);

            return filtered;
          } catch (error) {
            throw new Error();
          }
        },
        retry: 2
      },
      {
        queryKey: ['vercel-query'],
        queryFn: async () => {
          try {
            const response = await fetch('/api/vercel-project', {
              method: 'GET'
            });

            if (!response.ok) {
              throw new Error();
            }

            const json = await response.json();

            return json.data;
          } catch (error) {
            throw new Error();
          }
        },
        retry: 2
      }
    ]
  });

  const mutation = useMutation(
    async () => {
      try {
        const response = await fetch(functionProvider === AWS ? 'https://api.crl-devrel.net/create' : '/api/create', {
          method: 'POST',
          body: JSON.stringify({
            date: new Date()
          })
        });

        const json = await response.json();

        if (!response.ok) {
          throw new Error();
        }

        return json.data;
      } catch (error) {
        throw new Error();
      }
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(['read-query']);
      }
    }
  );

  const handleChange = () => {
    mutation.reset();
    functionProvider === AWS ? setFunctionProvider(VERCEL) : setFunctionProvider(AWS);
  };

  console.log(mutation);

  return (
    <section className={`grid grid-cols-1 ${isExpanded ? '' : 'xl:grid-cols-2'}`}>
      <div className={`bg-surface xl:min-h-screen shadow-lg ${isExpanded ? 'hidden' : 'block'}`}>
        <div className="flex flex-col p-6 md:p-8 h-full">
          <div className="grid gap-8 px-8 py-8">
            <Logo />
            <h1 className="sr-only">Edge</h1>
            <div className="grid gap-2">
              <p className="text-text text-sm text-center">
                Submit the location of your nearest <em className="font-bold">edge.</em>
              </p>
              <small className="block text-secondary text-center">
                Read more about this app on my{' '}
                <a
                  href="https://paulie.dev/posts/2023/02/cockroachlabs-interview-app/"
                  target="_blank"
                  rel="noopener"
                  className="underline text-primary hover:text-location"
                >
                  blog
                </a>
              </small>
            </div>
          </div>
          <aside className="flex flex-col gap-8 grow">
            <div className="flex flex-col">
              <div className="grid gap-2">
                <div className="flex items-center justify-between gap-4 h-12 min-h-full">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" value={functionProvider} onChange={handleChange} />
                    <div className="w-11 h-6 bg-lambda peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-serverless"></div>
                    <span className="ml-3 text-xs font-medium text-primary">{functionProvider}</span>
                  </label>
                  <button
                    className="min-w-[100px] rounded border border-location px-2 py-1 text-location disabled:border-border disabled:text-secondary disabled:cursor-not-allowed hover:text-primary hover:border-primary"
                    disabled={mutation.isLoading ? true : false}
                    type="button"
                    role="button"
                    onClick={() => {
                      mutation.mutate();
                    }}
                  >
                    {mutation.isLoading ? <Spinner /> : 'Submit'}
                  </button>
                </div>

                <div className="rounded border border-border px-2 py-2 flex items-center sm:h-10 min-h-full">
                  {mutation.isIdle ? <Empty /> : null}
                  {mutation.isLoading ? <Loading /> : null}
                  {mutation.isError ? <Error /> : null}
                  {mutation.isSuccess ? (
                    <ul className="flex flex-col sm:flex-row gap-2 text-xs text-primary">
                      <li>
                        <strong>Date: </strong>
                        <small className="text-current">
                          {mutation.data
                            ? `${new Date(mutation.data.date).toLocaleString('default', {
                                month: 'short',
                                day: 'numeric',
                                year: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                              })}`
                            : null}
                        </small>
                      </li>
                      <li>
                        <strong>City: </strong>
                        <small className="text-current"> {mutation.data ? `${mutation.data.city}` : null}</small>
                      </li>
                      <li>
                        <strong>Latitude: </strong>
                        <small className="text-current">
                          {' '}
                          {mutation.data ? `${parseFloat(mutation.data.lat)}` : null}{' '}
                        </small>
                      </li>
                      <li>
                        <strong>Longitude: </strong>
                        <small className="text-current">
                          {' '}
                          {mutation.data ? `${parseFloat(mutation.data.lng)}` : null}{' '}
                        </small>
                      </li>
                    </ul>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="overflow-hidden lg:grow">
              <div className="flex h-[420px] xl:h-[calc(100vh-520px)] rounded border border-border overflow-auto">
                {queries[0].status === 'loading' ? (
                  <div className="flex flex-col gap-3 items-center justify-center h-full w-full p-8">
                    <span className="block text-center text-text text-xs leading-5">
                      CockroachDB Multi-Region Serverless is in Beta. <br />
                      This might take a while.
                    </span>
                    <Spinner />
                  </div>
                ) : null}

                {queries[0].status === 'error' ? (
                  <div className="flex flex-col gap-3 items-center justify-center h-full w-full p-8">
                    <span className="block text-center text-serverless text-xs leading-5">
                      Can't reach database server. <br />
                      Refresh to try again.
                    </span>
                  </div>
                ) : null}

                {queries[0].status === 'success' ? (
                  <div className="flex-grow min-w-[400px] overflow-auto">
                    <table className="relative w-full">
                      <thead className="text-primary font-bold">
                        <tr>
                          <th className="sticky top-0 p-3 bg-thead text-left">Date</th>
                          <th className="sticky top-0 p-3 bg-thead text-left">City</th>
                          <th className="sticky top-0 p-3 bg-thead text-left">Latitude</th>
                          <td className="sticky top-0 p-3 bg-thead text-left">Longitude</td>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-divide bg-tbody text-text">
                        <Fragment>
                          {queries[0].data
                            .filter((item) => item.city)
                            .map((item, index) => {
                              const { date, city, lat, lng } = item;

                              return (
                                <tr key={index}>
                                  <td className="p-3 whitespace-nowrap">
                                    {new Date(date).toLocaleString('default', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: '2-digit'
                                    })}
                                  </td>
                                  <td className="p-3 whitespace-nowrap">{city}</td>
                                  <td className="p-3 whitespace-nowrap">{parseFloat(lat)}</td>
                                  <td className="p-3 whitespace-nowrap">{parseFloat(lng)}</td>
                                </tr>
                              );
                            })}
                        </Fragment>
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <a
                href=" https://github.com/PaulieScanlon/cockroachdb-edge-locations"
                target="_blank"
                rel="noopener"
                className="flex gap-2 items-center text-xs text-secondary hover:text-primary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  aria-label="GitHub Logo"
                >
                  <path d="M12.01,1.64c-5.83,0-10.55,4.75-10.55,10.63c0,4.7,3.02,8.67,7.21,10.08c0.52,0.11,0.72-0.23,0.72-0.51c0-0.25-0.02-1.09-0.02-1.97C6.44,20.5,5.83,18.6,5.83,18.6c-0.47-1.23-1.17-1.55-1.17-1.55C3.7,16.4,4.73,16.4,4.73,16.4c1.07,0.07,1.62,1.09,1.62,1.09c0.94,1.62,2.46,1.16,3.07,0.88c0.09-0.69,0.37-1.16,0.66-1.42c-2.34-0.25-4.8-1.16-4.8-5.24c0-1.16,0.42-2.11,1.08-2.85c-0.1-0.26-0.47-1.35,0.1-2.81c0,0,0.89-0.28,2.9,1.09c0.86-0.23,1.75-0.35,2.64-0.35c0.89,0,1.8,0.12,2.64,0.35c2.01-1.37,2.9-1.09,2.9-1.09c0.58,1.46,0.21,2.55,0.1,2.81c0.68,0.74,1.08,1.69,1.08,2.85c0,4.08-2.46,4.98-4.82,5.24c0.38,0.33,0.72,0.97,0.72,1.97c0,1.42-0.02,2.57-0.02,2.92c0,0.28,0.19,0.62,0.72,0.51c4.19-1.41,7.21-5.38,7.21-10.08C22.56,6.39,17.82,1.64,12.01,1.64z" />
                </svg>
                PaulieScanlon/cockroachdb-edge-locations
              </a>

              <a
                href="https://paulie.dev/posts/2023/02/cockroachlabs-interview-app/"
                target="_blank"
                rel="noopener"
                className="flex gap-2 items-center text-xs text-secondary hover:text-primary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="currentColor"
                  strokeWidth={1.2}
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  aria-label="GitHub Logo"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
                My Cockroach Labs Interview App
              </a>
            </div>
          </aside>
        </div>
      </div>

      <div className="bg-gradient-to-b from-black to-shade p-6 md:p-8 lg:p-0 overflow-scroll">
        <div className={`absolute top-1/2 bg-surface z-20 ${isExpanded ? 'left-0' : 'left-1/2'}`}>
          <button
            className="hidden xl:block bg-surface px-2 py-4 text-secondary hover:text-primary"
            type="button"
            role="button"
            aria-pressed={isExpanded ? true : false}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
              aria-label={isExpanded ? 'Collapse Icon' : 'Expand Icon'}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={
                  isExpanded
                    ? 'M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5'
                    : 'M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5'
                }
              />
            </svg>
          </button>
        </div>

        <div
          className={`relative overflow-hidden w-full ${
            isExpanded ? '' : 'h-[400px] md:h-[600px]'
          } xl:h-screen cursor-move rounded border border-border lg:border-none`}
        >
          <div className="absolute top-0 left-0 flex justify-between gap-2 text-text p-4 text-xs w-full z-10">
            <div>
              <span className="flex gap-1 items-center">
                <span className="w-2 h-2 rounded-full leading-none bg-location" />
                <strong>Total Edges: </strong>
                {queries[0].isSuccess ? `x${queries[0].data.length}` : <Spinner className="w-3 h-3" />}
              </span>
            </div>
            <div>
              <span className="flex gap-1">
                <strong>Zoom: </strong> <span className="hidden xl:block">Scroll</span>
                <span className="block xl:hidden">Pinch</span>
              </span>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 flex items-end justify-between gap-2 text-text p-4 text-xs z-10 select-none pointer-events-none">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <strong className="flex items-center gap-1 text-xs">
                  <span className="w-2 h-2 rounded-full leading-none bg-cluster" />
                  CockroachDB Serverless Regions
                </strong>

                <ul className="leading-5 text-xs">
                  <Fragment>
                    {data.regions.map((region, index) => {
                      const { name } = region;

                      return (
                        <li key={index} className="flex items-center gap-1">
                          <span>{fromProvider(name, data.cloud_provider).flag}</span>
                          <span>{fromProvider(name, data.cloud_provider).location}</span>
                          <span>{fromProvider(name, data.cloud_provider).raw}</span>
                        </li>
                      );
                    })}
                  </Fragment>
                </ul>
              </div>

              <div className="flex flex-col gap-1">
                <strong className="flex items-center gap-1 text-xs">
                  <span className="w-2 h-2 rounded-full leading-none bg-serverless" />
                  Vercel Serverless Region
                </strong>
                <ul className="leading-5 text-xs">
                  <li className="flex items-center gap-1 h-5">
                    {queries[1].isSuccess ? (
                      <Fragment>
                        <span>{fromProvider(queries[1].data.serverlessFunctionRegion, 'Vercel').flag}</span>
                        <span>{fromProvider(queries[1].data.serverlessFunctionRegion, 'Vercel').location}</span>
                        <span>{fromProvider(queries[1].data.serverlessFunctionRegion, 'Vercel').provider_region}</span>
                      </Fragment>
                    ) : (
                      <Spinner className="w-3 h-3" />
                    )}
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-1">
                <strong className="flex items-center gap-1 text-xs">
                  <span className="w-2 h-2 rounded-full leading-none bg-lambda" />
                  AWS Lambda Regions
                </strong>
                <ul className="leading-5 text-xs">
                  {lambda.map((region, index) => {
                    const { flag, location, raw } = region;
                    return (
                      <li className="flex items-center gap-1 h-5" key={index}>
                        <span>{flag}</span>
                        <span>{location}</span>
                        <span>{raw}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 right-0 flex items-end justify-between gap-2 text-text p-4 text-xs z-10 select-none">
            <button onClick={() => setIsPlaying(!isPlaying)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                {isPlaying ? (
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM9 8.25a.75.75 0 00-.75.75v6c0 .414.336.75.75.75h.75a.75.75 0 00.75-.75V9a.75.75 0 00-.75-.75H9zm5.25 0a.75.75 0 00-.75.75v6c0 .414.336.75.75.75H15a.75.75 0 00.75-.75V9a.75.75 0 00-.75-.75h-.75z"
                    clipRule="evenodd"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.603 3.113A1.125 1.125 0 019 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113z"
                    clipRule="evenodd"
                  />
                )}
              </svg>
            </button>
          </div>

          {queries[0].isSuccess && queries[1].isSuccess ? (
            <ThreeGlobe
              isPlaying={isPlaying}
              hasCurrent={mutation.data ? true : false}
              points={[
                {
                  type: 'location',
                  radius: 0.3,
                  altitude: 0.01,
                  colors: ['--color-location'],
                  data: queries[0].data.map((data) => {
                    const { lat, lng } = data;
                    return { latitude: lat, longitude: lng };
                  })
                },
                {
                  type: 'cluster',
                  radius: 0.4,
                  altitude: 0.03,
                  colors: ['--color-cluster'],
                  data: data.regions.map((region) => {
                    const location = fromProvider(region.name, data.cloud_provider);
                    return {
                      latitude: location.latitude,
                      longitude: location.longitude
                    };
                  })
                },
                {
                  type: 'serverless',
                  radius: 0.4,
                  altitude: 0.03,
                  colors: ['--color-serverless'],
                  data: [
                    {
                      latitude: fromProvider(queries[1].data.serverlessFunctionRegion, 'Vercel').latitude,
                      longitude: fromProvider(queries[1].data.serverlessFunctionRegion, 'Vercel').longitude
                    }
                  ]
                },
                {
                  type: 'lambda',
                  radius: 0.4,
                  altitude: 0.03,
                  colors: ['--color-lambda'],
                  data: lambda.map((region) => {
                    const { latitude, longitude } = region;

                    return {
                      latitude: latitude - 1,
                      longitude: longitude + 1
                    };
                  })
                },
                mutation.data
                  ? {
                      type: 'current',
                      radius: 0.4,
                      altitude: 0.07,
                      colors: ['--color-current'],
                      data: [
                        {
                          latitude: mutation.data.lat,
                          longitude: mutation.data.lng
                        }
                      ]
                    }
                  : null
              ]}
              rings={
                mutation.data
                  ? [
                      functionProvider === AWS
                        ? {
                            type: 'lambda',
                            colors: ['--color-lambda'],
                            data: [
                              {
                                latitude: fromProvider(mutation.data.region, 'AWS').latitude - 1,
                                longitude: fromProvider(mutation.data.region, 'AWS').longitude + 1
                              }
                            ]
                          }
                        : {
                            type: 'serverless',
                            colors: ['--color-serverless'],
                            data: [
                              {
                                latitude: fromProvider(queries[1].data.serverlessFunctionRegion, 'Vercel').latitude,
                                longitude: fromProvider(queries[1].data.serverlessFunctionRegion, 'Vercel').longitude
                              }
                            ]
                          }
                    ]
                  : []
              }
              route={
                mutation.data
                  ? [
                      {
                        type: 'current',
                        colors: ['--color-current'],
                        data: [
                          {
                            latitude: mutation.data.lat,
                            longitude: mutation.data.lng
                          }
                        ]
                      },
                      ...[
                        functionProvider === AWS
                          ? {
                              type: 'lambda',
                              colors: ['--color-lambda'],
                              data: [
                                {
                                  latitude: fromProvider(mutation.data.region, 'AWS').latitude - 1,
                                  longitude: fromProvider(mutation.data.region, 'AWS').longitude + 1
                                }
                              ]
                            }
                          : {
                              type: 'serverless',
                              colors: ['--color-serverless'],
                              data: [
                                {
                                  latitude: fromProvider(queries[1].data.serverlessFunctionRegion, 'Vercel').latitude,
                                  longitude: fromProvider(queries[1].data.serverlessFunctionRegion, 'Vercel').longitude
                                }
                              ]
                            }
                      ],
                      {
                        type: 'cluster',
                        colors: ['--color-cluster'],
                        data: data.regions
                          // .filter((region) => region.name === 'eu-central-1')
                          .map((region) => {
                            const location = fromProvider(region.name, data.cloud_provider);
                            return {
                              latitude: location.latitude,
                              longitude: location.longitude
                            };
                          })
                      }
                    ]
                  : []
              }
            />
          ) : null}
        </div>
      </div>
    </section>
  );
};

export async function getServerSideProps() {
  try {
    const response = await fetch(`https://cockroachlabs.cloud/api/v1/clusters/${process.env.COCKROACH_CLUSTER_ID}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.COCKROACH_CLOUD_SECRET_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error();
    }

    const json = await response.json();

    return {
      props: {
        message: 'A-OK',
        data: json
      }
    };
  } catch (error) {
    return {
      props: {
        message: 'Error!'
      }
    };
  }
}

export default Page;
