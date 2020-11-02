import { COMPANY_CONSTANT } from '../constants/CompanyConstant';
import AppUtil from 'js/utils/AppUtil';

export const loadFilterData = (data) => {
    return {
        type: COMPANY_CONSTANT.GET_FILTER_METADATA,
        payload: {
            data
        }
    }
}

export const getFilterMetaData = () => {
    return dispatch => {
        const url = "http://kaboom.rksv.net/api/historical?interval=1"
        AppUtil.ajax(url, undefined, a_response => {
            dispatch(loadFilterData(a_response))
        });
    }
}

export const updateCategoryValue = (category, selectedKey, selectedValue) => {
    return {
        type: COMPANY_CONSTANT.UPDATE_CATEGORY_VALUE,
        payload: {
            data: {
                category,
                selectedKey,
                selectedValue
            }
        }
    }
}

export const loadListingData = data => {
    return {
        type: COMPANY_CONSTANT.LOAD_LIST_DATA,
        payload: {
            data
        }
    }
}

export const onClickOfFilterApply = data => {
    return dispatch => {
        const url = "data/listData.json"
        AppUtil.ajax(url, undefined, a_response => {
            dispatch(loadListingData(a_response))
        });
    }
}