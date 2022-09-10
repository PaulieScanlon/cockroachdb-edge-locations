import React, { Fragment } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import Loading from '../components/loading';
import Error from '../components/error';
import Success from '../components/success';

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
    <div className="grid gap-4">
      <div>
        <h2>Add Location</h2>
        <div className="grid gap-4">
          <div className="min-h-[40px]">
            {mutation.isLoading ? <Loading /> : null}
            {mutation.isError ? <Error /> : null}
            {mutation.isSuccess ? <Success /> : null}
          </div>
          <pre className="min-h-[200px] m-0">{JSON.stringify(mutation.data, null, 2)}</pre>
          <button
            className="min-w-[120px] rounded bg-gray-100 border border-gray-200 px-3 py-1 justify-self-start font-bold"
            onClick={() => {
              mutation.mutate();
            }}
          >
            {mutation.isLoading ? 'Submitting' : 'Submit'}
          </button>
        </div>
      </div>
      <div>
        <h2>Read Locations</h2>
        <div className="grid gap-4">
          <div className="min-h-[40px]">
            {query.isLoading ? <Loading /> : null}
            {query.isError ? <Error /> : null}
            {query.isSuccess ? <Success /> : null}
          </div>

          <div className="h-[300px] overflow-scroll">
            <table>
              <thead className="font-bold">
                <tr>
                  <td>Id</td>
                  <td>Date</td>
                  <td>Location</td>
                </tr>
              </thead>

              <tbody>
                {query.isSuccess ? (
                  <Fragment>
                    {JSON.parse(query.data.data.locations).map((item, index) => {
                      const { id, date, location } = item;
                      return (
                        <tr key={index}>
                          <td className="text-xs text-gray-500">{id}</td>
                          <td className="font-semibold">{new Date(date).toLocaleString('default', { month: 'long', day: 'numeric', year: '2-digit' })}</td>
                          <td>{location}</td>
                        </tr>
                      );
                    })}
                  </Fragment>
                ) : null}
              </tbody>
            </table>
          </div>
          <pre className="min-h-[200px] m-0">{JSON.stringify(query.data, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default Page;
