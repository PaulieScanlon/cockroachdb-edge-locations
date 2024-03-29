import React from 'react';
import PropTypes from 'prop-types';

const CockroachLabsIcon = ({ className }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" stroke="none" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <title className="sr-only">cockroachlabs.com</title>
      <path d="M16.85,15.57h0c1.06-4.23-.45-8.7-3.85-11.43,2.11-1.21,4.6-1.61,6.98-1.13l.28-1.1c-.74-.15-1.5-.23-2.26-.23-2.13,0-4.21,.6-6,1.75-1.79-1.14-3.88-1.75-6-1.75-.76,0-1.51,.08-2.26,.23l.28,1.1c.65-.13,1.32-.2,1.98-.2,1.75,0,3.48,.46,5,1.33-4.82,3.87-5.59,10.91-1.72,15.73,.69,.86,1.5,1.61,2.4,2.23l.32,.22,.32-.22c2.26-1.55,3.87-3.87,4.53-6.53h0Zm-5.42,4.9c-3.03-2.62-4.22-6.79-3.02-10.61,.57,.95,1.29,1.82,2.11,2.56,.58,.52,.91,1.27,.91,2.05v6Zm.57-8.31c-.76-.57-1.44-1.24-2.01-2-.75-.99-.76-2.37,0-3.36,.57-.76,1.25-1.44,2.02-2.01,.78,.58,1.46,1.26,2.04,2.04,.73,.98,.73,2.32,0,3.29-.58,.77-1.27,1.46-2.04,2.03h0Zm.57,8.31v-6c0-.78,.33-1.53,.91-2.05,.83-.74,1.54-1.61,2.11-2.56,1.2,3.82,0,7.99-3.02,10.61Z" />
    </svg>
  );
};

CockroachLabsIcon.propTypes = {
  /** CSS classes */
  className: PropTypes.string
};

export default CockroachLabsIcon;
