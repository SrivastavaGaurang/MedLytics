import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Auth0Provider } from '@auth0/auth0-react';
import ProtectedApp from './ProtectedApp';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
      domain="life-gallery.us.auth0.com"
      clientId="UfKSbH15td8Rxho1l6LuHmfRjpybAr6E"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <ProtectedApp>
        <App />
      </ProtectedApp>
    </Auth0Provider>
  </React.StrictMode>
);
