import React from 'react';

import GoogleOAuth from './GoogleOAuth';

export default () => {
  return (
    <>
      <GoogleOAuth />
      <a
        href="/face"
        className="btn-face m-b-20"
        style={{ display: 'inline-block' }}
      >
        <i className="fa fa-facebook-official" />
        Facebook
      </a>
    </>
  );
};
