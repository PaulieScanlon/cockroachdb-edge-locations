import React, { Fragment } from 'react';
import Link from 'next/link';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import Spinner from '../components/spinner';
import Loading from '../components/loading';
import Error from '../components/error';
import Success from '../components/success';
import Logo from '../components/logo';

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

  const remove = async (id) => {
    try {
      const response = await (
        await fetch('/api/delete-location', {
          method: 'DELETE',
          body: JSON.stringify({
            id: id
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

  const mutation = useMutation(remove, {
    onSuccess: async () => {
      queryClient.invalidateQueries(['query']);
    }
  });

  return (
    <section className="grid gap-8 mx-auto p-6 md:p-8">
      {/* <pre className="text-text">{JSON.stringify(mutation, null, 2)}</pre> */}
      <div className="flex justify-between items-center rounded bg-surface px-4 py-2">
        <div className="flex gap-4 items-center">
          <Link href="/">
            <a>
              <Logo className="w-12" />
            </a>
          </Link>
          <p className="text-primary text-xs mt-1">
            No auth, <em className="font-bold">YOLO</em>
          </p>
        </div>
        <Link href="/">
          <a className="text-xs text-secondary bg-background/30 rounded p-3 hover:text-primary hover:bg-background/80">Back</a>
        </Link>
      </div>
      <aside className="grid gap-8">
        <div className="grid gap-4">
          <div className="overflow-hidden">
            <div className="flex flex-col h-[600px] overflow-hidden">
              <div className="flex-grow overflow-auto rounded border border-border">
                <table className="relative w-full m-0">
                  <thead className="text-primary font-bold">
                    <tr>
                      <th className="sticky top-0 p-3 bg-table-thead text-left">Id</th>
                      <th className="sticky top-0 p-3 bg-table-thead text-left">Date</th>
                      <th className="sticky top-0 p-3 bg-table-thead text-left">City</th>
                      <th className="sticky top-0 p-3 bg-table-thead text-left">Latitude</th>
                      <td className="sticky top-0 p-3 bg-table-thead text-left">Longitude</td>
                      <td className="sticky top-0 p-3 bg-table-thead text-left">Delete</td>
                    </tr>
                  </thead>

                  {query.isSuccess ? (
                    <tbody className="divide-y divide-table-divide bg-table-tbody text-text">
                      <Fragment>
                        {JSON.parse(query.data.data.locations)
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
                                <td className="p-3 whitespace-nowrap">
                                  <button
                                    className="min-w-[100px] min-h-[34px] rounded border border-secondary px-2 py-1 text-primary disabled:border-neutral-700 disabled:cursor-not-allowed"
                                    disabled={mutation.isLoading && mutation.variables === id ? true : false}
                                    onClick={() => {
                                      mutation.mutate(id);
                                    }}
                                  >
                                    {mutation.isLoading && mutation.variables === id ? <Spinner /> : 'Delete'}
                                  </button>
                                </td>
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
          {/* <pre className="min-h-[200px] m-0">{JSON.stringify(query.data, null, 2)}</pre> */}
        </div>
      </aside>
    </section>
  );
};

export default Page;
