import { APP_CONSTANT } from '../constants/AppConstants';

export const initAppComp = () => {
    return {
        type: APP_CONSTANT.INIT_APP
    }
}

export const showLoading = () => {
    return {
        type: APP_CONSTANT.SHOW_LOADING
    }
}

export const hideLoading = () => {
    return {
        type: APP_CONSTANT.HIDE_LOADING
    }
}