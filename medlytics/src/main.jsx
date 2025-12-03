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
      domain="gaurang-dev.us.auth0.com"
    clientId="Be6QIK8pbPkLeuSBGwdcZDxZXJrHxgd3"
      authorizationParams={{
        redirectUri: 'http://localhost:5173',
      }}
    >
      <ProtectedApp>
        <App />
      </ProtectedApp>
    </Auth0Provider>
  </React.StrictMode>
);
