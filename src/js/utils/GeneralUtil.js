import DOMPurify from 'dompurify'

export const getSanitizeData = a_inputString => {
    const config = {
        ALLOWED_TAGS: [], 
        RETURN_DOM: false, 
        USE_PROFILES: {html: false},
        ALLOW_DATA_ATTR: false
    };

    return DOMPurify.sanitize(a_inputString, config);
}