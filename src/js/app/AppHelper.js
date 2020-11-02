/**
 * NOTE: This file is AMD supported
 *
 * This file will only contain methods written in plain javascript
 *
 **/
(function ( root, factory ) {
	if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    }
} (this, function () {
    let m_config;
    let m_params = {};
    let m_authToken;

	return {
		/**
		 * this api return the json object of logged in User.
		 */
		getLoggedInUser () {
			return m_config.loggedInUser;
        },

        /**
		 * this api return the param value passed in story mapping URL.
		 */
        getParamData ( a_key ) {
            return m_params[a_key];
        },

        /**
         * this api return the param value passed in story mapping URL.
         */
        setParamData ( a_params ) {
            m_params = a_params;
        },

		/**
		 * This method will send an ajax call to get the application/user related config from the server
		 */
		initConfig ( a_config ) {
            m_config = a_config
        },

        /**
		 * this api return the config value given in initConfig api.
		 */
        getAppData ( a_key ) {
            return m_config ? m_config[ a_key ] : undefined;
        },

        /**
		 * this api sets app config according to passed key and value
		 */
        setAppData ( a_key, a_value ) {
            if ( m_config ) {
                m_config[ a_key ] = a_value;
            }
        },

        /**
		 * this api return the user action
		 */
        getUserAction ( a_key ) {
            return m_config && m_config.actions ? m_config.actions[ a_key ] : undefined;
        },

        /**
		 * this api sets the user action
		 */
        setUserAction ( a_key, a_value ) {
            m_config.actions[ a_key ] = a_value;
        },

        /*
        * pass app authorization token
         */
        setAppAppAuthToken ( a_authToken ) {
            m_authToken = a_authToken;
        },

        /*
        * returns app authorization token
         */
        getAppAppAuthToken () {
            return m_authToken;
        },

        setParamMap () {
            let w_params;

            if ( window.location.href.indexOf('?') !== -1 ) {
                w_params = window.location.href.slice( window.location.href.indexOf('?') + 1, window.location.href.length );
            } else {
                w_params = window.location.href.slice( window.location.href.indexOf('&') + 1, window.location.href.length );
            }

            if (w_params !== '') {
                const w_paramsArr = w_params.split( '&' );
    
                w_paramsArr.forEach( a_param => {
                    const w_paramSplit = a_param.split( '=' );
    
                    m_params[ w_paramSplit[0] ] = w_paramSplit[1];
                } );
            }
        },

        loadCustomCSSFiles(cssFiles) {
            cssFiles.forEach( cssFile => {
                const link = document.createElement('link');

                link.href = cssFile;
                link.rel = 'stylesheet';
                link.type = 'text/css';

                document.head.appendChild(link);
            } );
        }
    };
}));