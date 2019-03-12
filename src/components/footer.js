import React from 'react';

import './footer.css';

export default () => {
  return (
    <footer className="footer">
      <div className="footer-love">
        <p>
          Made with <i className="fas fa-heart" /> &{' '}
          <i className="fas fa-mug-hot" /> by Milad
        </p>
      </div>
      <div className="footer-social">
        <ul className="footer-follow">
          <li>
            <a
              className="twitter"
              href="https://twitter.com/miladdarren"
              rel="noopener noreferrer"
              target="_blank"
            >
              <i className="fab fa-twitter fa-lg" />
            </a>
          </li>
          <li>
            <a
              className="instagram"
              href="https://instagram.com/miladdarren"
              rel="noopener noreferrer"
              target="_blank"
            >
              <i className="fab fa-instagram fa-lg" />
            </a>
          </li>
          <li>
            <a
              className="linkedin"
              href="https://linkedin.com/in/miladdarren"
              rel="noopener noreferrer"
              target="_blank"
            >
              <i className="fab fa-linkedin-in fa-lg" />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};
