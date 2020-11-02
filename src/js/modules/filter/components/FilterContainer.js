import { connect } from 'react-redux';
import FilterView from './FilterView';
import {updateCategoryValue, onClickOfFilterApply} from 'js/modules/company/actions/CompanyListingAction'

const mapStateToProps = (state, ownProps) => {
    const { companyData } = state.companyData;
    
    return {
        companyData,
        store: ownProps.store
    };
}

const mapDispatchToProps = dispatch => {
    return {
        updateCategoryValue : (category, selectedKey, selectedValue) => {
            dispatch(updateCategoryValue(category, selectedKey, selectedValue))
        },
        onClickOfFilterApply: data => {
            dispatch(onClickOfFilterApply(data))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterView);