import { showLoading, hideLoading } from 'js/app/actions/AppActions.js';
import fetch from 'unfetch';

let appStore;

export const setAppStore = store => {
    appStore = store;
}

export const getAppStore = () => appStore;

const AppUtil = {
    ajaxCounter: 0,

    ajax(url, data, successFn, failureFn, isResponseRequired, options, showMask = true) {
        const that = this;

        if (showMask) {
            this.ajaxCounter++;
            that.showHideAppMask();
        }

        const option = {
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (data) {
            option.body = JSON.stringify(data);
            option.method = 'POST';
        } else {
            option.method = 'GET';
        }

        if (options) {
            for (const key in options) {
                option[key] = options[key];
            }
        }

        fetch(url, option)
            .then( response => response && !isResponseRequired ? response.json() : response )
            .then( result => {
                    if (showMask) {
                        that.ajaxCounter--;
                        that.showHideAppMask();
                    }

                    if (successFn) {
                        successFn(result);
                    }

                }
            )
            .catch(function (err) {
                if (showMask) {
                    that.ajaxCounter--;
                    that.showHideAppMask();
                }

                if (failureFn) {
                    failureFn(err);
                }
            });
        
    },

    showHideAppMask() {
        if (appStore) {
            if (this.ajaxCounter === 0) {
                appStore.dispatch(hideLoading());
            } else {
                appStore.dispatch(showLoading());
            }
        }
    }
}

export default AppUtil;