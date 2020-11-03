import { DASHBOARD_CONSTANT } from '../constants/DashboardConstant';

const initialState = {
    liveChartData: []
};

const DashboardReducer = (state = initialState, action) => {
    switch (action.type) {
        case DASHBOARD_CONSTANT.GET_CHART_DATA:
            return {
                ...state,
                chartData: action.payload.data
            }
        case DASHBOARD_CONSTANT.UPDATE_LIVE_CHART:
            if(state.liveChartData && state.liveChartData.length > 200) {
                state.liveChartData.shift()
            }
            return {
                ...state,
                liveChartData: [...state.liveChartData, action.payload.data]
            }
        default:
            return state;
    }
};

export default DashboardReducer;