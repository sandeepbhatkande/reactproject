import { connect } from 'react-redux';
import ChartView from './ChartView';
import {updateChart} from 'js/modules/dashboard/actions/DashboardAction'

const mapStateToProps = (state, ownProps) => {
    
    return {
        chartData : ownProps.chartData,
        store: ownProps.store
    };
}

const mapDispatchToProps = dispatch => {
    return {
        updateChart: data => {
            dispatch( updateChart(data) )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChartView);