import React from 'react';
import { Link } from 'react-router-dom';

import './notFound.css';

export default () => {
  return (
    <div className="not-found">
      <div className="not-found-404">
        <h1>
          4<span />4
        </h1>
      </div>
      <h2>Oops! Looks like you got lost</h2>
      <Link to="/">Back to homepage</Link>
    </div>
  );
};
