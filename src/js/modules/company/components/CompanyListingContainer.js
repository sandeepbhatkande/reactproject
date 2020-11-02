import { connect } from 'react-redux';
import CompanyListingView from './CompanyListingView';
import {getFilterMetaData} from '../actions/CompanyListingAction'

const mapStateToProps = (state, ownProps) => {
    const { companyData } = state.companyData;
    
    return {
        companyData,
        store: ownProps.store
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getFilterMetaData: () => {
            dispatch( getFilterMetaData() )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyListingView);