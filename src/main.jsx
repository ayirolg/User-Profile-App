import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import { store } from './redux/store.js';
import ReactDOM from 'react-dom/client';
import {worker} from './mocks/browser';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter } from 'react-router-dom';

worker.start({
  serviceWorker: {
    url: '/User-Profile-App/mockServiceWorker.js',
  },
}).then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <BrowserRouter basename="/User-Profile-App"> {/* ✅ wrap with basename */}
        <App />
      </BrowserRouter>
    </Provider>
  );
});

