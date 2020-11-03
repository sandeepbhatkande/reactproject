import { DASHBOARD_CONSTANT } from '../constants/DashboardConstant';
import AppUtil from 'js/utils/AppUtil';
import io from 'socket.io-client';

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
    var socket = io('http://kaboom.rksv.net/watch');
    socket.on('sub', function(data){ 
        console.log("open" + data)
    });
    socket.on('event', function(data){
        console.log("event"+data)
    });
    socket.on('disconnect', function(){console.log("close")});
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

