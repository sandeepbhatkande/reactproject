import { DASHBOARD_CONSTANT } from '../constants/DashboardConstant';
import AppUtil from 'js/utils/AppUtil';

export const updateLiveChart= data => {
    return {
        type: DASHBOARD_CONSTANT.UPDATE_LIVE_CHART,
        payload: {
            data
        }
    }
}

export const loadChartData = (data) => {
    return {
        type: DASHBOARD_CONSTANT.GET_CHART_DATA,
        payload: {
            data
        }
    }
}

export const getChartData = () => {
    return dispatch => {
        const url = "http://kaboom.rksv.net/api/historical?interval=1"
        AppUtil.ajax(url, undefined, a_response => {
            dispatch(loadChartData(a_response))
        });
    }
}


export const updateChart = (data) => {
    return dispatch => {
        const url = "http://kaboom.rksv.net/api/historical?interval="+ data
        AppUtil.ajax(url, undefined, a_response => {
            dispatch(loadChartData(a_response))
        });
    }
}

