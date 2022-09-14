import React, { Fragment } from 'react';
import Link from 'next/link';
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

  const read = async () => {
    try {
      const response = await (
        await fetch('/api/read-locations', {
          method: 'GET'
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
        <div className="p-6 md:p-8">
          <div className="grid gap-8 px-8 py-8">
            <Logo />
            <h1 className="sr-only">Edge</h1>
            <p className="text-text text-xs text-center">
              Submit the location of your nearest <em className="font-bold">edge.</em>
            </p>
          </div>
          <aside className="grid gap-8">
            <div className="grid gap-2">
              <div className="grid grid-cols-1fr-auto gap-2 min-h-[36px]">
                {/* <Loading /> */}
                {/* <Error /> */}
                {/* <Success /> */}
                {mutation.isLoading ? <Loading /> : null}
                {mutation.isError ? <Error /> : null}
                {mutation.isSuccess ? <Success /> : null}
                {mutation.isIdle ? <Empty /> : null}
                <button
                  className="min-w-[100px] rounded border border-secondary px-2 py-1 text-primary disabled:border-border disabled:cursor-not-allowed"
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
                  <small className="text-announce-success">{mutation.data ? `${mutation.data.data.date}` : null}</small>
                </li>
                <li>
                  <strong>City: </strong>
                  <small className="text-announce-success"> {mutation.data ? `${mutation.data.data.city}` : null}</small>
                </li>
                <li>
                  <strong>Latitude: </strong>
                  <small className="text-announce-success"> {mutation.data ? `${mutation.data.data.lat}` : null} </small>
                </li>
                <li>
                  <strong>Longitude: </strong>
                  <small className="text-announce-success"> {mutation.data ? `${mutation.data.data.lng}` : null} </small>
                </li>
              </ul>
            </div>

            <div className="overflow-hidden">
              <div className="flex flex-col h-[300px] overflow-hidden">
                <div className="flex-grow overflow-auto rounded border border-border">
                  <table className="relative w-full">
                    <thead className="text-primary font-bold">
                      <tr>
                        <th className="sticky top-0 p-3 bg-table-thead text-left">Id</th>
                        <th className="sticky top-0 p-3 bg-table-thead text-left">Date</th>
                        <th className="sticky top-0 p-3 bg-table-thead text-left">City</th>
                        <th className="sticky top-0 p-3 bg-table-thead text-left">Latitude</th>
                        <td className="sticky top-0 p-3 bg-table-thead text-left">Longitude</td>
                      </tr>
                    </thead>

                    {query.isSuccess ? (
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
                              const dateFormat = new Date(date).toLocaleString('default', { month: 'short', day: 'numeric', year: '2-digit' });
                              return (
                                <tr key={index}>
                                  <td className="text-xs text-secondary p-3">{id}</td>
                                  <td className="p-3 whitespace-nowrap">{dateFormat}</td>
                                  <td className="p-3 whitespace-nowrap">{city}</td>
                                  <td className="p-3 whitespace-nowrap">{lat}</td>
                                  <td className="p-3 whitespace-nowrap">{lng}</td>
                                </tr>
                              );
                            })}
                        </Fragment>
                      </tbody>
                    ) : null}
                  </table>

                  {query.isLoading ? (
                    <div className="flex items-center justify-center h-[240px]">
                      <Spinner />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center gap-4">
              <a
                href=" https://github.com/PaulieScanlon/cockroachdb-edge-locations"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-secondary hover:text-primary"
              >
                github.com/PaulieScanlon/cockroachdb-edge-locations
              </a>
              <Link href="/admin">
                <a className="text-xs text-secondary bg-background/30 rounded p-3 hover:text-primary hover:bg-background/80">Admin</a>
              </Link>
            </div>
          </aside>
        </div>
      </div>
      <div className="bg-gradient-to-b from-black to-shade p-6 md:p-8 lg:p-0 overflow-scroll">
        <div className="relative w-full h-[300px] lg:h-screen cursor-move rounded border border-border">
          <div className="absolute top-0 right-0 text-text p-4 text-xs flex flex-col gap-2">
            <span>
              <strong>Zoom: </strong>Scroll
            </span>
            <span>
              <strong>Pan: </strong>⌘ Click
            </span>
          </div>
          <ThreeScene
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
