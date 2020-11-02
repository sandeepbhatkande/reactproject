import { APP_CONSTANT } from 'js/app/constants/AppConstants';
import * as actions from 'js/app/actions/AppActions';

describe('AppActions', () => {
    describe('showLoading', () => {
        it('It shows loading mask', () => {
            expect( actions.showLoading() ).toEqual( {
                type: APP_CONSTANT.SHOW_LOADING
            } );
        });
    });

    describe('hideLoading', () => {
        it('It shows loading mask', () => {
            expect( actions.hideLoading() ).toEqual( {
                type: APP_CONSTANT.HIDE_LOADING
            } );
        });
    });
});