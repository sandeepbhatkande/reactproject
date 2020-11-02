import React from 'react';
import MessageContainer from 'js/modules/message/components/MessageContainer';
import DashboardContainer from 'js/modules/dashboard/components/DashboardContainer'

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        this.props.initAppComp();
    }

    render() {
        return (
            <React.Fragment>
                <DashboardContainer/>
                <MessageContainer store={this.props.store} />
                {
                    this.props.appData && this.props.appData.showMask &&
                    <div className='app_mask full_width full_height'>
                        <img src='svg/loading.svg' className='vertical_align' alt='Loading'></img>
                    </div>
                }
            </React.Fragment>
        )
    }
    
}

export default App