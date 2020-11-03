import { connect } from 'react-redux';
import DashboardView from './DashboardView';
import {getChartData, updateLiveChart} from '../actions/DashboardAction'

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
        },
        updateLiveChart: data => {
            dispatch(updateLiveChart(data))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardView);