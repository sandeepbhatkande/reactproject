import { APP_CONSTANT } from '../constants/AppConstants';

const initialState = {
};

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case APP_CONSTANT.INIT_APP:
            return {
                ...state,
                appData: {
                    showMask: false
                }
            }
        case APP_CONSTANT.SHOW_LOADING:
            return {
                ...state,
                appData: Object.assign({}, state.appData, {
                    showMask: true
                })
            }
        case APP_CONSTANT.HIDE_LOADING:
            return {
                ...state,
                appData: Object.assign({}, state.appData, {
                    showMask: false
                })
            }
        default:
            return state;
    }
};

export default appReducer;