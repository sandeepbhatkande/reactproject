import React from 'react';
import FilterContainer from '../../filter/components/FilterContainer';

class CompanyListingView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
            showFilter: false
        };
	}

	componentDidMount() {
        this.props.getFilterMetaData()
    }
    
    onFilterClick () {
        this.setState({showFilter: !this.state.showFilter})
    }

    hideFilter () {
        this.setState({showFilter: false})
    }
	
	render() {
        const companyData = this.props.companyData
        if (Object.keys(this.props).length === 0 || !companyData || !companyData.filterMetaData) {
			return false;
        }

        const listData = companyData.listData || {columns:[], rows:[]} 

		return (
			<React.Fragment>
                <div className="listingContainer">
                    <div className="listingHeader">
                        {
                            listData.columns.map (data => (
                            <span key={data.key} className="tableColumn"> {data.name}</span>
                            )) 
                        }
                    </div>
                    <filter className="listFilter" onClick={this.onFilterClick.bind(this)}>Filter</filter>
                    <div className="listingBody">
                        {listData.rows.length === 0 &&
                            <div>No Data Found</div>
                        }
                        {
                            listData.rows.map ((data, index) => (
                            <div className="tableRow" key ={index}>{listData.columns.map( (row, index1) =>(
                            <span className="rowValue" key= {index1}>{data[row.key]}</span>
                            ))}</div>
                            ))
                        }
                    </div>
                </div>
                {
                    this.state.showFilter &&
                    <FilterContainer filterData = {companyData.filterMetaData} hideFilter= {this.hideFilter.bind(this)}></FilterContainer>
                }
            </React.Fragment>
		);
	}
}

export default CompanyListingView;