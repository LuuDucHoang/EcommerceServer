const path = require('path')
const uploadSingleFile = async (file) => {
    const uploadPath = path.resolve(__dirname, '../public/images/upload')
    let extName = path.extname(file.name);
    let baseName = path.basename(file.name, extName)
    let finalName = `${baseName}-${Date.now()}${extName}`
    let finalPath = `${uploadPath}/${finalName}`

    // Use the mv() method to place the file somewhere on your server


    try {
        await file.mv(finalPath);
        return {
            name: file.name,
            status: 'succes',
            path: finalName,
            err: null
        }

    } catch (error) {
        return {
            name: file.name,
            status: 'fail',
            path: null,
            err: JSON.stringify(error)
        }
    }

}
const uploadMultipleFiles = async (files) => {


    try {
        const uploadPath = path.resolve(__dirname, '../public/images/upload')
        const message = [];
        let contSuccess = 0;
        for (let i = 0; i < files.length; i++) {
            let extName = path.extname(files[i].name);
            let baseName = path.basename(files[i].name, extName)
            let finalName = `${baseName}-${Date.now()}${extName}`
            let finalPath = `${uploadPath}/${finalName}`
            try {
                await files[i].mv(finalPath);
                message.push({
                    name: files[i].name,
                    status: 'succes',
                    path: finalName,
                    err: null
                })
                contSuccess = contSuccess + 1;
            } catch (error) {
                message.push({
                    name: files[i].name,
                    status: 'fail',
                    path: null,
                    err: JSON.stringify(error)
                })
            }
        }
        return {
            message,
            contSuccess
        }

    } catch (error) {
        console.log(error)
    }
}


module.exports = {
    uploadSingleFile, uploadMultipleFiles
}