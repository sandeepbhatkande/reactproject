import AppHelper from 'js/app/AppHelper';

const featureSupport = {
	/* #feautureName#: {
		SK: '7.8',
        SE: '8.0',
        EASe: '5.6'
    } */
}

const isFeatureEnable = featureName => {
    let enabled = false;

    const sourceType = AppHelper.getBoardData('enterpriseType')
    const sourceVersion = AppHelper.getParamData('currentbuildversion').split(".");
    const supportedVersion = featureSupport[featureName][sourceType].split('.');

    sourceVersion[0] = parseInt(sourceVersion[0].replace(/%20/g, '').match(/\d/g).join(''));
    sourceVersion[1] = parseInt(sourceVersion[1]);
    supportedVersion[0] = parseInt(supportedVersion[0]);
    supportedVersion[1] = parseInt(supportedVersion[1]);

    if ( sourceVersion[0] > supportedVersion[0] || 
        ( sourceVersion[0] === supportedVersion[0] && sourceVersion[1] >= supportedVersion[1] )) {
            enabled = true;
    }

    return enabled;
}

export default isFeatureEnable;