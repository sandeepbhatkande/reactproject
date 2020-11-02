import {
    createStore,
    applyMiddleware,
    compose,
    combineReducers
} from 'redux';
import thunk from 'redux-thunk';
import MessageReducer from 'js/modules/message/reducers/MessageReducer';
import appReducer from 'js/app/reducers/AppReducer';
import CompanyListingReducer from 'js/modules/company/reducers/CompanyListingReducer';
import DashboardReducer from 'js/modules/dashboard/reducers/DashboardReducer';

const rootReducer = combineReducers({
    messageData: MessageReducer,
    appData: appReducer,
    companyData: CompanyListingReducer,
    dashboardData: DashboardReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore( rootReducer, composeEnhancers( applyMiddleware(thunk) ) );

export default store;