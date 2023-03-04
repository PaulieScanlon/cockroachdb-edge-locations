import React from 'react';

const Error = () => {
  return (
    <div className="rounded border border-border px-2 py-1 text-text">
      <strong className="text-serverless">Error:</strong>
      <small className="ml-1">500</small>
    </div>
  );
};

export default Error;
