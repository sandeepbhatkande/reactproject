/* istanbul ignore file */
import React from 'react';
import { hideMessage } from '../actions/MessageActions';
import { BOARD_MESSAGE_CONSTANT } from '../constants/MessageConstants';
import { getI18NMessage } from 'I18N/I18NHelper';

class MessageView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {};
		this.hideMessage = this.hideMessage.bind(this);
	};

	componentDidMount() {
        this.props.initMessageComp();
	};
	
	render() {
		if ( Object.keys(this.props).length === 0 || !this.props.messageData || !this.props.messageData.show ) {
			return false;
		}

		const messageData = this.props.messageData;
		const type = messageData.type;

		const isErrorMsg = type === BOARD_MESSAGE_CONSTANT.TYPE_ERROR;
		const isSuccess = type === BOARD_MESSAGE_CONSTANT.TYPE_SUCCESS;
		const isWarning = type === BOARD_MESSAGE_CONSTANT.TYPE_WARNING;
		const isInfo = type === BOARD_MESSAGE_CONSTANT.TYPE_INFO;
		const isConfirmation = type === BOARD_MESSAGE_CONSTANT.TYPE_CONFIRMATION;

		const config = {
			header: messageData.headerText,
			message: messageData.message,
			actionLabels: messageData.actionLabels,
			dontShowMeAgain: messageData.dontShowMeAgain,
			dialogHeaderIcon: isErrorMsg ? 'icon-Error' : isInfo ? 'icon-info' : isSuccess ? 
				'icon-success' : isWarning || isConfirmation ? 'icon-Warning' : '',
			showMainBox: messageData.showMainBox,
			type
		};

	};

	hideMessage(value, doNotShowAgain) {
		this.props.store.dispatch( hideMessage() );

		if ( value && this.props.messageData.onConfirmFn ) {
			this.props.messageData.onConfirmFn(doNotShowAgain);
		}
	};
}

export default MessageView;