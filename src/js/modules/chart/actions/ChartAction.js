import { CARD_CONSTANT } from '../constants/ChartConstant';
import AppUtil from 'js/utils/AppUtil';

export const updateChartData = (data) => {
    return {
        type: CARD_CONSTANT.UPDATE_CHART_DATA,
        payload: {
            data
        }
    }
}

export const updateChart = (data) => {
    return dispatch => {
        const url = "http://kaboom.rksv.net/api/historical?interval="+data
        AppUtil.ajax(url, undefined, a_response => {
            dispatch(updateChartData(a_response))
        });
    }
}
