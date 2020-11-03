/* istanbul ignore file */
import React from 'react';
import { hideMessage } from '../actions/MessageActions';

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

	};

	hideMessage(value, doNotShowAgain) {
		this.props.store.dispatch( hideMessage() );

		if ( value && this.props.messageData.onConfirmFn ) {
			this.props.messageData.onConfirmFn(doNotShowAgain);
		}
	};
}

export default MessageView;