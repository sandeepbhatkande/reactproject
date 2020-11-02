import { COMPANY_CONSTANT } from '../constants/CompanyConstant';

const initialState = {
};

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case COMPANY_CONSTANT.GET_FILTER_METADATA:
            return {
                ...state,
                companyData: Object.assign({}, state.companyData, {
                    filterMetaData: action.payload.data
                })
            }
        case COMPANY_CONSTANT.UPDATE_CATEGORY_VALUE:
            const FilterCategory = state.companyData.filterMetaData[action.payload.data.category]
            const objIndex = FilterCategory.findIndex((obj => obj.name === action.payload.data.selectedKey));
            FilterCategory[objIndex].selected = action.payload.data.selectedValue
            return {
                ...state,
                companyData: {
                    ...state.companyData,
                    filterMetaData: {
                        ...state.companyData.filterMetaData,
                        [action.payload.data.category]: FilterCategory  
                    }
                }
            } 
        case COMPANY_CONSTANT.LOAD_LIST_DATA:
            return {
                ...state,
                companyData: Object.assign({}, state.companyData, {
                    listData: action.payload.data
                })
            }
        default:
            return state;
    }
};

export default appReducer;