import React from 'react';
import ReactDOM from 'react-dom';
import 'src/index.css';
import App from 'src/App';
import reportWebVitals from 'src/reportWebVitals';
// import { Store } from './context/store';
/* import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min.js'; */

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
