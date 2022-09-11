import React from 'react';

const Loading = () => {
  return (
    <div className="rounded border border-border px-2 py-1 text-text">
      <strong className="text-announce-loading">Loading:</strong>
      <small className="ml-1">...</small>
    </div>
  );
};

export default Loading;
