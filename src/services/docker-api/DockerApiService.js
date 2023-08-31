import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.BASE_DOCKER_URL || 'https://Docke-BackD-7QAVGJK8QDZJ-154944622.eu-west-1.elb.amazonaws.com',
});

const handleErrorAndReturnData = async (request) => {
    try {
        const response = await request;
        return response;
    } catch (error) {
        console.error('Error:', error);
        throw error; 
    }
};

export const apiRequests = {

    async getImageURL(cardID, fileName) {
        return await handleErrorAndReturnData(apiClient.get('/get-image-url', { cardID, fileName }));
    },

    async getUploadImageURL(cardID, fileName, fileType) {
        return await handleErrorAndReturnData(apiClient.get('/get-upload-image-url', { cardID, fileName, fileType }));
    },
};