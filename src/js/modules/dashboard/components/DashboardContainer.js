import { connect } from 'react-redux';
import DashboardView from './DashboardView';
import {getChartData} from '../actions/DashboardAction'

const mapStateToProps = (state, ownProps) => {
    const { dashboardData } = state;
    
    return {
        dashboardData,
        store: ownProps.store
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getChartData: () => {
            dispatch( getChartData() )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardView);