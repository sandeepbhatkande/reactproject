import { showLoading, hideLoading } from 'js/app/actions/AppActions.js';
import AppHelper from 'js/app/AppHelper';
import properties from 'properties';
import { APP_URL_CONSTANTS } from 'js/common/constants/GlobalConstants';
import { showMessage } from 'js/modules/message/actions/MessageActions';
import { BOARD_MESSAGE_CONSTANT } from 'js/modules/message/constants/MessageConstants';
import map from 'lodash/map';
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

        if (AppHelper.getAppAppAuthToken()) {
            option.headers.Authorization = AppHelper.getAppAppAuthToken();
        }

        if (data && properties.isIntegrated) {
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

            if (properties.isIntegrated && properties.isELKEnabled) {
                setTimeout(AppUtil.logtoELK, 0,  url, {...data}, {...option})
            }
        
    },

    logtoELK(url, data, option){
        const URLS = Object.entries(APP_URL_CONSTANTS);

        const entry = URLS.find( entryItem => url.indexOf(entryItem[1]) !== -1 )

        if (entry) {
            const logData = {
                baseURL: properties.url,
                path: entry[1],
                action: entry[0],
                method: option ? option.method : "GET",
                loginid: AppHelper.getAppData('user_data') && AppHelper.getAppData('user_data').loginid,
                firstname: AppHelper.getAppData('user_data') && AppHelper.getAppData('user_data').firstname,
                lastname: AppHelper.getAppData('user_data') && AppHelper.getAppData('user_data').lastname,
                email: AppHelper.getAppData('user_data') && AppHelper.getAppData('user_data').email,
                timezone: AppHelper.getAppData('user_data') && AppHelper.getAppData('user_data').timezone
            };

            logData.password = null;

            fetch(properties.ELKURL, {"method":"POST", "body": JSON.stringify(logData)});
        }
    },

    showHideAppMask() {
        if (appStore) {
            if (this.ajaxCounter === 0) {
                appStore.dispatch(hideLoading());
            } else {
                appStore.dispatch(showLoading());
            }
        }
    },

    getErrorMessage(a_response) {
        if ( a_response.m_errorList ) {
            const w_error = a_response.m_errorList[0];

            appStore.dispatch( showMessage({
                type: BOARD_MESSAGE_CONSTANT.TYPE_ERROR,
                message: this.processErrorMessage(w_error)
            }) );
       }

       return a_response.m_errorList ? false : true;
    },

    processErrorMessage(a_error) {
        let w_messages = [], w_message = "", w_errorJSON = {};

        try {
            const w_errorJsonStr = a_error.substring(a_error.indexOf("{"), a_error.lastIndexOf("}") + 1);
            w_errorJSON = JSON.parse(w_errorJsonStr);

            if( w_errorJSON.Response && w_errorJSON.Response.messageView.type === "error" ){

                map(w_errorJSON.Response.details, obj => {
                    w_messages = [...w_messages, ...obj.map(el => el.responseMsg)];
                });
                
                w_message = w_messages.length ? w_messages.join("\n") : w_errorJSON.Response.messageView.message.join("\n");

            } else if ( w_errorJSON.message && w_errorJSON.message.Error && w_errorJSON.message.Error.indexOf("\"Error\":{") !== -1 ) {
                w_message = JSON.parse(w_errorJSON.message.Error).Error[""].trim();
            } else if ( w_errorJSON.message && w_errorJSON.message.error && w_errorJSON.message.error.indexOf("\"error\":") !== -1 ) {
                w_message = JSON.parse(w_errorJSON.message.error).error.trim();
            } else if ( w_errorJSON.message && w_errorJSON.message.error && w_errorJSON.message.error.indexOf("<Errors>") !== -1 ) {
                w_message = w_errorJSON.message.error.substring(w_errorJSON.message.error.indexOf("<Error code='25'>") + 17, w_errorJSON.message.error.indexOf("</Error>")).trim()
            } else if ( w_errorJSON.message && w_errorJSON.message.Error ) {
                w_message = w_errorJSON.message.Error.trim();
            }
        } catch(err) {
            w_message = "There seems to be an error !"
        }

        return w_message;
    }
}

export default AppUtil;