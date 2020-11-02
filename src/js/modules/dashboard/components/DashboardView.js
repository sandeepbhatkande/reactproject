import React from 'react';
import ChartContainer from '../../chart/components/ChartContainer';

class DashboardView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
            showFilter: false
        };
	}

	componentDidMount() {
        this.props.getChartData()
    }
	
	render() {
        const dashboardData = this.props.dashboardData
        if (Object.keys(this.props).length === 0 || !dashboardData || !dashboardData.chartData) {
			return false;
        }

		return (
			<React.Fragment>
                <ChartContainer chartData = {dashboardData.chartData}/>       
            </React.Fragment>
		);
	}
}

export default DashboardView;