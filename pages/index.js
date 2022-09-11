import React, { Fragment } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import Spinner from '../components/spinner';
import Empty from '../components/empty';
import Loading from '../components/loading';
import Error from '../components/error';
import Success from '../components/success';

import ThreeScene from '../components/three-scene';

const Page = () => {
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

  const mutation = useMutation(create);

  return (
    <section className="grid xl:grid-cols-2">
      <div className="bg-surface xl:h-screen shadow-lg">
        <div className="p-8">
          <div className="px-8 py-16">
            <h1 className="text-transparent uppercase text-6xl font-black text-center bg-clip-text bg-gradient-to-r from-hero-start to-hero-end">
              Edge Locations
            </h1>
            <p className="text-text text-xs text-center">Click Submit to add the location of your nearest edge.</p>
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
              <ul className="flex gap-2 text-xs text-announce-success px-3 rounded border border-border p-3">
                <li>
                  <strong>Date: </strong>
                  {mutation.data ? `${mutation.data.data.date}` : null}
                </li>
                <li>
                  <strong>City: </strong>
                  {mutation.data ? `${mutation.data.data.city}` : null}
                </li>
                <li>
                  <strong>Latitude: </strong>
                  {mutation.data ? `${mutation.data.data.lat}` : null}{' '}
                </li>
                <li>
                  <strong>Longitude: </strong>
                  {mutation.data ? `${mutation.data.data.lng}` : null}{' '}
                </li>
              </ul>
            </div>

            <div className="overflow-hidden">
              <div className="flex flex-col max-h-[400px] overflow-hidden">
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

                    <tbody className="divide-y divide-table-divide bg-table-tbody text-text">
                      {query.isSuccess ? (
                        <Fragment>
                          {JSON.parse(query.data.data.locations)
                            .filter((location) => location.city !== 'Test')
                            .reduce((items, item) => {
                              const city = items.find((obj) => obj.city === item.city);
                              if (!city) {
                                return items.concat([item]);
                              } else {
                                return items;
                              }
                            }, [])
                            .sort((a, b) => b.id - a.id)
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
                      ) : null}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="text-xs text-secondary hover:text-primary">
              <a href=" https://github.com/PaulieScanlon/cockroachdb-edge-locations" target="_blank" rel="noreferrer">
                github.com/cockroachdb-edge-locations
              </a>
            </div>
          </aside>
        </div>
      </div>
      <div className="relative bg-gradient-to-b from-black to-shade">
        <div className="absolute w-full h-screen cursor-move">
          <ThreeScene locations={query.isSuccess ? JSON.parse(query.data.data.locations).filter((location) => location.city !== 'Test') : []} />
        </div>
      </div>
    </section>
  );
};

export default Page;
