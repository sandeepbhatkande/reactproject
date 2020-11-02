import { BOARD_MESSAGE_CONSTANT } from '../constants/MessageConstants';

const initialState = {
    show: false
};

const MessageReducer = (state = initialState, action) => {
	switch (action.type) {
        case BOARD_MESSAGE_CONSTANT.INIT_MESSAGE:
            return {
                ...state,
                messageData: {
                    show: false,
                    type: undefined, //eg.confirmation/error/warning/success/info
                    message: undefined
  
                }
            }
        case BOARD_MESSAGE_CONSTANT.SHOW_MESSAGE:
            return {
                ...state,
                messageData: Object.assign({}, state.messageData, {
                    show: true,
                    type: action.config.type,
                    message: action.config.message,
                    onConfirmFn: action.config.onConfirmFn,
                    headerText: action.config.headerText,
                    actionLabels: action.config.actionLabels,
                    dontShowMeAgain: action.config.dontShowMeAgain,
                    showMainBox: action.config.showMainBox
                })
            }
        case BOARD_MESSAGE_CONSTANT.HIDE_MESSAGE:
            return {
                ...state,
                messageData: Object.assign({}, state.messageData, {
                    show: false,
                    type: undefined,
                    message: undefined,
                    showMainBox: false,
                    dontShowMeAgain: false,
                    actionLabels: undefined,
                    onConfirmFn: undefined
                })
            }
		default:
            return state;
	}
};

export default MessageReducer;