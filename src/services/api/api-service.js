import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://00jmg9ex3k.execute-api.eu-west-1.amazonaws.com/dev',
    timeout: 10000,
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

    async getColumns() {
        return await handleErrorAndReturnData(apiClient.get('/columns'));
    },

    async createColumn(columnTitle) {
        return await handleErrorAndReturnData(apiClient.post('/create-column', { columnTitle }));
    },

    async getColumnByID(columnID) {
        return await handleErrorAndReturnData(apiClient.get(`/get-column/${columnID}`));
    },

    async updateColumn(columnID, columnTitle) {
        return await handleErrorAndReturnData(apiClient.put(`/update-columns/${columnID}`, { columnTitle }));
    },

    async deleteColumn(columnID) {
        return await handleErrorAndReturnData(apiClient.delete(`/delete-columns/${columnID}`));
    },

    async getMaxColumnIndex() {
        return await handleErrorAndReturnData(apiClient.get('columns/maxIndex'));
    },

    async getCards() {
        return await handleErrorAndReturnData(apiClient.get('/cards'));
    },

    async createCard({ columnID, cardTitle }) {
        return await handleErrorAndReturnData(apiClient.post(`/create-card/${columnID}`, { cardTitle }));
    },

    async getCardByID(cardID) {
        return await handleErrorAndReturnData(apiClient.get(`/get-card/${cardID}`));
    },

    async updateCard(cardTitle, cardID, cardDescription) {
        return await handleErrorAndReturnData(apiClient.put(`/update-card/${cardID}`, { cardTitle, cardDescription }));
    },

    async getCardsByColumnID(columnID) {
        return await handleErrorAndReturnData(apiClient.get(`/columns/${columnID}/cards`));
    },

    async deleteCard(cardID) {
        return await handleErrorAndReturnData(apiClient.delete(`/delete-card/${cardID}`));
    },

    async getMaxCardIndex(columnID) {
        return await handleErrorAndReturnData(apiClient.get(`columns/${columnID}/maxIndex`));
    },

    async moveCard(cardID, columnID, prevCardIndex, nextCardIndex) {
        return await handleErrorAndReturnData(apiClient.put(`/cards/${cardID}/${columnID}/${prevCardIndex}/${nextCardIndex}/move`));
    },

    async moveColumn(columnID, prevColumnIndex, nextColumnIndex) {
        return await handleErrorAndReturnData(apiClient.put(`/columns/${columnID}/${prevColumnIndex}/${nextColumnIndex}/move`));
    },

};
