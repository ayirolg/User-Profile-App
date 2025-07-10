import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import { store } from './redux/store.js';
import ReactDom from 'react-dom/client';
import {worker} from './mocks/browser';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

worker.start().then(() => {
  ReactDom.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <App/>
    </Provider>
  );
})
