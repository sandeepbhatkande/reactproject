import { BOARD_MESSAGE_CONSTANT } from '../constants/MessageConstants';

export const initMessageComp = () => {
    return {
        type: BOARD_MESSAGE_CONSTANT.INIT_MESSAGE
    }
}

export const showMessage = config => {
    return {
        type: BOARD_MESSAGE_CONSTANT.SHOW_MESSAGE,
        config
    }
}

export const hideMessage = config => {
    return {
        type: BOARD_MESSAGE_CONSTANT.HIDE_MESSAGE,
        config
    }
}