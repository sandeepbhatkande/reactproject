import React from 'react';

class FilterView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedCategory: undefined
		};
	}

	componentDidMount() {
	}

	onClickOfCategory (event) {
		const selectedValue = event.target.innerText
		this.setState({selectedCategory: selectedValue})
	}

	onChangeFilter (event) {
		const selectedCategory = this.state.selectedCategory
		const selectedKey = event.target.value
		const selectedValue = event.target.checked
		this.props.updateCategoryValue(selectedCategory, selectedKey, selectedValue)

	}

	onClickOfFilterApply () {
		this.props.onClickOfFilterApply(this.props.filterData)
		this.props.hideFilter()
	}
	
	render() {
		const filterData = this.props.filterData
		const filteredCategory = filterData[this.state.selectedCategory] || []
        
		return (
			<div className="filterContainer">
				<div className="filterHeader">Filter</div>
				<div className="filterBody">
					<div className="commonField">
						<ul className="listItems">
						{
							Object.keys(filterData).map((item, index) => (
								<li className={`listItem ${this.state.selectedCategory === item ? "selected": ""}`} key={index} onClick= {this.onClickOfCategory.bind(this)}>{item}</li>
							))
						}
						</ul>
					</div>
					<div className="detailField">
						{
							filteredCategory.map ((data, index)=> (
							<div key={index}>
								<input type="checkbox" name={data.name} value={data.name} 
								onChange={this.onChangeFilter.bind(this)} checked= {data.selected}/>
  								<label htmlFor={data.name}> {data.name} </label>
							</div>
							)) 
						}
					</div>
				</div>
				<div className="filterFooter">
					<div className="filterApplyButton" onClick={this.onClickOfFilterApply.bind(this)}>Apply</div>
				</div>
			</div>
		);
	}
}

export default FilterView;