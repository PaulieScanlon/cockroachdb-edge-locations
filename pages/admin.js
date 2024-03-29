import React, { Fragment } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import Spinner from '../components/spinner';
import Logo from '../components/logo';

const Page = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const query = useQuery(
    {
      queryKey: ['query'],
      queryFn: async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_AWS_API_URL}/read`, {
            method: 'GET'
          });

          const json = await response.json();

          if (!response.ok) {
            throw new Error();
          }

          return json.data.locations;
        } catch (error) {
          throw new Error();
        }
      }
    },
    {
      retry: 10
    }
  );

  const mutation = useMutation(
    async (id) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_AWS_API_URL}/delete`, {
          method: 'DELETE',
          body: JSON.stringify({
            id: id
          })
        });

        const json = await response.json();

        if (!response.ok) {
          throw new Error();
        }

        return json;
      } catch (error) {
        throw new Error();
      }
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(['query']);
      }
    }
  );

  return (
    <section className="grid gap-8 mx-auto p-6 md:p-8">
      <div className="flex justify-between items-center rounded bg-surface px-4 py-2">
        <div className="flex gap-4 items-center">
          <Link href="/">
            <Logo className="w-12" />
          </Link>
        </div>
        <Fragment>
          {session ? (
            <button
              onClick={() => signOut()}
              className="text-xs text-secondary bg-background/30 rounded p-3 hover:text-primary hover:bg-background/80"
            >
              Sign out
            </button>
          ) : (
            <button
              onClick={() => signIn('github')}
              className="text-xs text-secondary bg-background/30 rounded p-3 hover:text-primary hover:bg-background/80"
            >
              Sign in
            </button>
          )}
        </Fragment>
      </div>
      {session?.user.admin ? (
        <aside className="grid gap-8">
          <span className="flex gap-1 items-center text-primary text-xs">
            <span className="w-2 h-2 rounded-full leading-none bg-location" />
            <strong>Total Edges: </strong>
            {query.data ? `x${query.data.length}` : <Spinner className="w-3 h-3" />}
          </span>
          <div className="grid gap-4">
            <div className="overflow-hidden">
              <div className="flex flex-col h-full lg:h-[600px] overflow-hidden">
                <div className="flex-grow overflow-auto rounded border border-border">
                  <table className="relative w-full m-0">
                    <thead className="text-primary font-bold">
                      <tr>
                        <th className="sticky top-0 p-3 bg-thead text-left">Id</th>
                        <th className="sticky top-0 p-3 bg-thead text-left">Date</th>
                        <th className="sticky top-0 p-3 bg-thead text-left">City</th>
                        <th className="sticky top-0 p-3 bg-thead text-left">Latitude</th>
                        <td className="sticky top-0 p-3 bg-thead text-left">Longitude</td>
                        <td className="sticky top-0 p-3 bg-thead text-left">Runtime</td>
                        <td className="sticky top-0 p-3 bg-thead text-left">Delete</td>
                      </tr>
                    </thead>

                    {query.data ? (
                      <tbody className="divide-y divide-divide bg-tbody text-text">
                        <Fragment>
                          {query.data
                            .sort((a, b) => b.id - a.id)
                            .map((item, index) => {
                              const { id, date, city, lat, lng, runtime } = item;

                              return (
                                <tr key={index} className="hover:bg-primary/10">
                                  <td className="text-xs text-secondary p-3">{id}</td>
                                  <td className="p-3 whitespace-nowrap">
                                    {new Date(date).toLocaleString('default', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: '2-digit'
                                    })}
                                  </td>
                                  <td className="p-3 whitespace-nowrap">{`${city || '* city not recognized'}`}</td>
                                  <td className="p-3 whitespace-nowrap">{parseFloat(lat)}</td>
                                  <td className="p-3 whitespace-nowrap">{parseFloat(lng)}</td>
                                  <td className="p-3 whitespace-nowrap">{runtime}</td>
                                  <td className="p-3 whitespace-nowrap">
                                    <button
                                      className="min-w-[100px] min-h-[34px] rounded border border-red-800 bg-red-600 text-white px-2 py-1 text-primary disabled:border-neutral-700 disabled:bg-secondary disabled:cursor-not-allowed"
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
                    <div className="flex items-center justify-center h-[540px]">
                      <Spinner />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </aside>
      ) : null}
    </section>
  );
};

export default Page;
