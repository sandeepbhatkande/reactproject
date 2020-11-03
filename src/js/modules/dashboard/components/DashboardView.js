import React from 'react';
import ChartContainer from '../../chart/components/ChartContainer';
import { subscribeToStock, unSubscribeToStock } from 'js/api';

class DashboardView extends React.Component {
	constructor(props) {
        super(props);

		this.state = {
            showFilter: false,
            selectedTab: "home"
        };
	}

	componentDidMount() { 
        this.props.getChartData()
    }

    onClickOnTab(tab) {
        this.setState({selectedTab: tab})
        const that = this 
        if(tab !== 'home') {
            subscribeToStock((err, a_data) => { 
                that.props.updateLiveChart(a_data)
            });
        } else {
            unSubscribeToStock()
        }
    }
	
	render() {
        const dashboardData = this.props.dashboardData
        if (Object.keys(this.props).length === 0 || !dashboardData || !dashboardData.chartData) {
			return false;
        }

        if(this.state.selectedTab !== 'home' && ( !dashboardData || !dashboardData.liveChartData || dashboardData.liveChartData.length === 0)) {
            return false
        }

		return (
			<React.Fragment>
                <div className="tab_header">
                    <span className={`home ${this.state.selectedTab === 'home' ? 'active': ''}`} onClick={this.onClickOnTab.bind(this, "home")}>Home</span>
                    <span className={`live_chart ${this.state.selectedTab === 'live_chart' ? 'active': ''}`} onClick={this.onClickOnTab.bind(this, "live_chart")}>Live Chart</span>
                </div>
                { (this.state.selectedTab === "home" &&
                    <ChartContainer chartData = {dashboardData.chartData} homePage={true}/>)|| <ChartContainer chartData = {dashboardData.liveChartData}/>
                }       
            </React.Fragment>
		);
	}
}

export default DashboardView;