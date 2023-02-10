import React, { Fragment, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import Logo from '../components/logo';
import Spinner from '../components/spinner';
import Empty from '../components/empty';
import Loading from '../components/loading';
import Error from '../components/error';
import Success from '../components/success';

import ThreeScene from '../components/three-scene';

const Page = () => {
  const queryClient = useQueryClient();
  const [isPlaying, setIsPlaying] = useState(true);

  const read = async () => {
    try {
      const response = await fetch('/api/read-locations', {
        method: 'GET'
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error();
      }
      return json;
    } catch (error) {
      throw new Error();
    }
  };

  const create = async () => {
    try {
      const response = await (
        await fetch('/api/create-location', {
          method: 'POST',
          body: JSON.stringify({
            date: new Date()
          })
        })
      ).json();

      if (!response.data) {
        throw new Error();
      }
      return response;
    } catch (error) {
      throw new Error();
    }
  };

  const query = useQuery(['query'], read, {
    retry: 2
  });

  const mutation = useMutation(create, {
    onSuccess: async () => {
      queryClient.invalidateQueries(['query']);
    }
  });

  return (
    <section className="grid xl:grid-cols-2">
      <div className="bg-surface xl:min-h-screen shadow-lg">
        <div className="flex flex-col p-6 md:p-8 h-full">
          <div className="grid gap-8 px-8 py-8">
            <Logo />
            <h1 className="sr-only">Edge</h1>
            <p className="text-text text-xs text-center">
              Submit the location of your nearest <em className="font-bold">edge.</em>
            </p>
          </div>
          <aside className="flex flex-col gap-8 grow">
            <div className="flex flex-col">
              <div className="grid gap-2">
                <div className="grid grid-cols-1fr-auto gap-2 min-h-[36px]">
                  {mutation.isLoading ? <Loading /> : null}
                  {mutation.isError ? <Error /> : null}
                  {mutation.isSuccess ? <Success /> : null}
                  {mutation.isIdle ? <Empty /> : null}
                  <button
                    className="min-w-[100px] rounded border border-hero-end px-2 py-1 text-hero-start disabled:border-border disabled:text-secondary disabled:cursor-not-allowed hover:text-primary hover:border-primary"
                    disabled={mutation.isLoading ? true : false}
                    onClick={() => {
                      mutation.mutate();
                    }}
                  >
                    {mutation.isLoading ? <Spinner /> : 'Submit'}
                  </button>
                </div>
                <ul className="flex gap-2 text-xs text-primary px-3 rounded border border-border p-3">
                  <li>
                    <strong>Date: </strong>
                    <small className="text-announce-success">
                      {mutation.data ? `${mutation.data.data.date}` : null}
                    </small>
                  </li>
                  <li>
                    <strong>City: </strong>
                    <small className="text-announce-success">
                      {' '}
                      {mutation.data ? `${mutation.data.data.city}` : null}
                    </small>
                  </li>
                  <li>
                    <strong>Latitude: </strong>
                    <small className="text-announce-success">
                      {' '}
                      {mutation.data ? `${mutation.data.data.lat}` : null}{' '}
                    </small>
                  </li>
                  <li>
                    <strong>Longitude: </strong>
                    <small className="text-announce-success">
                      {' '}
                      {mutation.data ? `${mutation.data.data.lng}` : null}{' '}
                    </small>
                  </li>
                </ul>
              </div>
            </div>

            <div className="overflow-hidden grow">
              <div className="flex max-h-[400px] lg:max-h-[calc(100vh-460px)] h-full rounded border border-border overflow-hidden">
                {query.isLoading ? (
                  <div className="flex items-center justify-center h-full w-full">
                    <Spinner />
                  </div>
                ) : null}

                {query.isSuccess ? (
                  <div className="flex-grow overflow-auto">
                    <table className="relative w-full">
                      <thead className="text-primary font-bold">
                        <tr>
                          <th className="sticky top-0 p-3 bg-table-thead text-left">Date</th>
                          <th className="sticky top-0 p-3 bg-table-thead text-left">City</th>
                          <th className="sticky top-0 p-3 bg-table-thead text-left">Latitude</th>
                          <td className="sticky top-0 p-3 bg-table-thead text-left">Longitude</td>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-table-divide bg-table-tbody text-text">
                        <Fragment>
                          {JSON.parse(query.data.data.locations)
                            .sort((a, b) => b.id - a.id)
                            .filter((location) => location.city !== 'Test')
                            .reduce((items, item) => {
                              const city = items.find((obj) => obj.city === item.city);
                              if (!city) {
                                return items.concat([item]);
                              } else {
                                return items;
                              }
                            }, [])
                            .map((item, index) => {
                              const { id, date, city, lat, lng } = item;
                              const dateFormat = new Date(date).toLocaleString('default', {
                                month: 'short',
                                day: 'numeric',
                                year: '2-digit'
                              });
                              return (
                                <tr key={index}>
                                  <td className="p-3 whitespace-nowrap">{dateFormat}</td>
                                  <td className="p-3 whitespace-nowrap">{`${city || '* city not recognized'}`}</td>
                                  <td className="p-3 whitespace-nowrap">{lat}</td>
                                  <td className="p-3 whitespace-nowrap">{lng}</td>
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
                rel="opener"
                className="flex gap-2 items-center text-xs text-secondary hover:text-primary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  aria-label="GitHub Logo"
                >
                  <path
                    d="M12.01,1.64c-5.83,0-10.55,4.75-10.55,10.63c0,4.7,3.02,8.67,7.21,10.08c0.52,0.11,0.72-0.23,0.72-0.51
		c0-0.25-0.02-1.09-0.02-1.97C6.44,20.5,5.83,18.6,5.83,18.6c-0.47-1.23-1.17-1.55-1.17-1.55C3.7,16.4,4.73,16.4,4.73,16.4
		c1.07,0.07,1.62,1.09,1.62,1.09c0.94,1.62,2.46,1.16,3.07,0.88c0.09-0.69,0.37-1.16,0.66-1.42c-2.34-0.25-4.8-1.16-4.8-5.24
		c0-1.16,0.42-2.11,1.08-2.85c-0.1-0.26-0.47-1.35,0.1-2.81c0,0,0.89-0.28,2.9,1.09c0.86-0.23,1.75-0.35,2.64-0.35
		c0.89,0,1.8,0.12,2.64,0.35c2.01-1.37,2.9-1.09,2.9-1.09c0.58,1.46,0.21,2.55,0.1,2.81c0.68,0.74,1.08,1.69,1.08,2.85
		c0,4.08-2.46,4.98-4.82,5.24c0.38,0.33,0.72,0.97,0.72,1.97c0,1.42-0.02,2.57-0.02,2.92c0,0.28,0.19,0.62,0.72,0.51
		c4.19-1.41,7.21-5.38,7.21-10.08C22.56,6.39,17.82,1.64,12.01,1.64z"
                  />
                </svg>
                PaulieScanlon/cockroachdb-edge-locations
              </a>

              <a
                href="https://paulie.dev/posts/2023/02/cockroachlabs-interview-app/"
                target="_blank"
                rel="opener"
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
        <div className="relative w-full h-[600px] lg:h-screen cursor-move rounded border border-border lg:border-none">
          <div className="hidden xl:flex absolute top-0 right-0 text-text p-4 text-xs flex-col gap-2 z-10">
            <span>
              <strong>Zoom: </strong>Scroll
            </span>
            <span>
              <strong>Pan: </strong>⌘ Click
            </span>
          </div>
          <div className="absolute bottom-0 right-0 text-text p-4 text-xs z-10">
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
          <ThreeScene
            isPlaying={isPlaying}
            locations={
              query.isSuccess
                ? JSON.parse(query.data.data.locations)
                    .filter((location) => location.city !== 'Test')
                    .reduce((items, item) => {
                      const city = items.find((obj) => obj.city === item.city);
                      if (!city) {
                        return items.concat([item]);
                      } else {
                        return items;
                      }
                    }, [])
                : []
            }
          />
        </div>
      </div>
    </section>
  );
};

export default Page;
