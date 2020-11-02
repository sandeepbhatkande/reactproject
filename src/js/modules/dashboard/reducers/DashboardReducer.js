import { DASHBOARD_CONSTANT } from '../constants/DashboardConstant';

const initialState = {
};

const DashboardReducer = (state = initialState, action) => {
    switch (action.type) {
        case DASHBOARD_CONSTANT.GET_CHART_DATA:
            return {
                ...state,
                chartData: action.payload.data
            }
        default:
            return state;
    }
};

export default DashboardReducer;