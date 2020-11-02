import { connect } from 'react-redux';
import MessageView from './MessageView';
import { initMessageComp } from '../actions/MessageActions';

const mapStateToProps = (state, ownProps) => {
    const { messageData } = state.messageData;
    
    return {
        messageData,
        store: ownProps.store
    };
}

const mapDispatchToProps = dispatch => {
    return {
        initMessageComp: () => {
            dispatch( initMessageComp() )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageView);