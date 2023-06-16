const path = require('path');
const config = require('../config/firebase.config');
const { initializeApp } = require('firebase/app');
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require('firebase/storage');
const giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const dateTime = date + ' ' + time;
    return dateTime;
};

initializeApp(config.firebaseConfig);
const storage = getStorage();
const uploadSingleFile = async (file) => {
    const uploadPath = path.resolve(__dirname, '../public/images/upload');
    let extName = path.extname(file.name);
    let baseName = path.basename(file.name, extName);
    let finalName = `${baseName}-${Date.now()}${extName}`;
    let finalPath = `${uploadPath}/${finalName}`;

    // Use the mv() method to place the file somewhere on your server
    try {
        await file.mv(finalPath);
        return {
            name: file.name,
            status: 'succes',
            path: finalName,
            err: null,
        };
    } catch (error) {
        return {
            name: file.name,
            status: 'fail',
            path: null,
            err: JSON.stringify(error),
        };
    }
};
const uploadMultipleFiles = async (files) => {
    try {
        const uploadPath = path.resolve(__dirname, '../public/images/upload');
        const message = [];
        let contSuccess = 0;
        for (let i = 0; i < files.length; i++) {
            let extName = path.extname(files[i].name);
            let baseName = path.basename(files[i].name, extName);
            let finalName = `${baseName}-${Date.now()}${extName}`;
            let finalPath = `${uploadPath}/${finalName}`;
            try {
                await files[i].mv(finalPath);
                message.push({
                    name: files[i].name,
                    status: 'succes',
                    path: finalName,
                    err: null,
                });
                contSuccess = contSuccess + 1;
            } catch (error) {
                message.push({
                    name: files[i].name,
                    status: 'fail',
                    path: null,
                    err: JSON.stringify(error),
                });
            }
        }
        return {
            message,
            contSuccess,
        };
    } catch (error) {
        console.log(error);
    }
};
const uploadFIleToFireBase = async (file) => {
    try {
        const dateTime = giveCurrentDateTime();

        const storageRef = ref(storage, `files/${file.originalname + '       ' + dateTime}`);

        const metadata = {
            contentType: file.mimetype,
        };

        const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log(downloadURL);
        console.log('File successfully uploaded.');
        return {
            name: file.name,
            status: 'succes',
            path: downloadURL,
            err: null,
        };
    } catch (error) {
        console.log(error);
        return {
            name: file.name,
            status: 'fail',
            path: null,
            error,
        };
    }
};
module.exports = {
    uploadSingleFile,
    uploadMultipleFiles,
    uploadFIleToFireBase,
};
