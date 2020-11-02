const FileUtil = {
    getBase64Image( imgEl ) {
        /* NOTE:imgElem must be on the same server otherwise a cross-origin error 
        will be thrown "SECURITY_ERR: DOM Exception 18" */
        
        const img = document.createElement('img');
        img.src = imgEl.src;
        
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(imgEl, 0, 0);
        
        return canvas.toDataURL('image/png');
    }
}

export default FileUtil;