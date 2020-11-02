import { APP_CONSTANT } from 'js/app/constants/AppConstants';
import appReducer from 'js/app/reducers/AppReducer';

describe('AppReducer', () => {
    describe('appReducer', () => {
        it('INIT_APP', () => {
            const actual = appReducer({}, {
                type: APP_CONSTANT.INIT_APP
            });

            expect(actual).toEqual({
                appData: {
                    showMask: false
                }
            });
        });

        it('SHOW_LOADING', () => {
            const actual = appReducer({}, {
                type: APP_CONSTANT.SHOW_LOADING,
                appData: {
                    showMask: false
                }
            });

            expect(actual).toEqual({
                appData: {
                    showMask: true
                }
            });
        });

        it('HIDE_LOADING', () => {
            const actual = appReducer({}, {
                type: APP_CONSTANT.HIDE_LOADING,
                appData: {
                    showMask: true
                }
            });

            expect(actual).toEqual({
                appData: {
                    showMask: false
                }
            });
        });
    });
});