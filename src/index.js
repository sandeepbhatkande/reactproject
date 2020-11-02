import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import AppContainer from './js/app/components/AppContainer';
import store from './js/store/StoreConfigure';
import './assets/sass/styles.scss';
import AppHelper from 'js/app/AppHelper';
import { setAppStore } from 'js/utils/AppUtil';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './i18n';

setAppStore(store);

AppHelper.setParamMap();

ReactDOM.render((
    <Provider store={ store }>
        <AppContainer store={ store }/>
    </Provider>)
, document.getElementById('root'));

serviceWorker.unregister();