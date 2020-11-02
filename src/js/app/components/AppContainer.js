import { connect } from 'react-redux';
import App from './App';
import { initAppComp } from '../actions/AppActions';

const mapStateToProps = (state, ownProps) => {
    const { appData } = state.appData;

    return {
        appData,
        store: ownProps.store
    };
}

const mapDispatchToProps = dispatch => {
    return {
        initAppComp: () => {
            dispatch( initAppComp() )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);