import React, { Fragment } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

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
    <section>
      <div>
        <div className="grid gap-2 grid-cols-1fr-auto">
          <div>
            {mutation.isLoading ? <Loading /> : null}
            {mutation.isError ? <Error /> : null}
            {mutation.isSuccess ? <Success /> : null}
          </div>
          <button
            className="min-w-[100px] rounded border border-gray-200 px-2 py-1 text-gray-100 text-xs"
            onClick={() => {
              mutation.mutate();
            }}
          >
            {mutation.isLoading ? 'Submitting' : 'Submit'}
          </button>
        </div>
      </div>
      <div className="w-full h-screen cursor-move">
        <ThreeScene locations={query.isSuccess ? JSON.parse(query.data.data.locations).filter((location) => location.city !== 'Test') : []} />
      </div>
    </section>
  );
};

export default Page;
