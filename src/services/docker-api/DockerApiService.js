import axios from 'axios';

console.log('test');
console.log(process.env);
console.log(process.env.VUE_APP_BASE_DOCKER_URL);

const apiClient = axios.create({
    baseURL: process.env.VUE_APP_BASE_DOCKER_URL,
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

export const dockerRequests = {

    async getImageURL(cardID) {
        return await handleErrorAndReturnData(apiClient.post('/get-image-url', {
            cardID: cardID,
        } ));
    },

    async getUploadImageURL(cardID, fileType) {
        return await handleErrorAndReturnData(apiClient.post('/get-upload-image-url', {
            cardID: cardID,
            fileType: fileType,
        }));
    },

    async getDeleteImageURL(cardID) {
        return await handleErrorAndReturnData(apiClient.post('/get-delete-image-url', {
            cardID: cardID,
        } ));
    },

    async deleteFile(deleteUrl) {
        return await handleErrorAndReturnData(apiClient.delete(deleteUrl));
    },

    async uploadFile(uploadUrl, file) {
        return await handleErrorAndReturnData(apiClient.put(uploadUrl, file, 
            {
                headers: {
                    'Content-Type': file.type,
                },
            },
        ));
    },
};
