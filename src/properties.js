const properties = {
	url: process.env.REACT_APP_SM_DATA_URL,
    
	isIntegrated: false,

	authTokenPassword: '111111',
	
	isELKEnabled: false,

	ELKURL: undefined
};

export const setProperties = (config) => {
	if ( config ) {
		for ( const key in config ) {
			properties[key] = config[key];
		}
	}
}

export default properties;