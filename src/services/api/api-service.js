import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://00jmg9ex3k.execute-api.eu-west-1.amazonaws.com/dev',
    timeout: 10000,
});

async function handleErrorAndReturnNull(request) {
    try {
        const response = await request;
        return response.data.data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export const apiRequests = {

    async getColumns() {
        return handleErrorAndReturnNull(apiClient.get('/columns'));
    },

    async createColumn(columnTitle) {
        return handleErrorAndReturnNull(apiClient.post('/create-column', { columnTitle }));
    },

    async getColumnByID(columnID) {
        return handleErrorAndReturnNull(apiClient.get(`/get-column/${columnID}`));
    },

    async updateColumn(columnID, columnTitle) {
        return handleErrorAndReturnNull(apiClient.put(`/update-columns/${columnID}`, { columnTitle }));
    },

    async deleteColumn(columnID) {
        return handleErrorAndReturnNull(apiClient.delete(`/delete-columns/${columnID}`));
    },

    async getMaxColumnIndex() {
        return handleErrorAndReturnNull(apiClient.get('columns/maxIndex'));
    },

    async getCards() {
        return handleErrorAndReturnNull(apiClient.get('/cards'));
    },

    async createCard({ columnID, cardTitle }) {
        return handleErrorAndReturnNull(apiClient.post(`/create-card/${columnID}`, { cardTitle }));
    },

    async getCardByID(cardID) {
        return handleErrorAndReturnNull(apiClient.get(`/get-card/${cardID}`));
    },

    async updateCard(cardTitle, cardID, cardDescription) {
        return handleErrorAndReturnNull(apiClient.put(`/update-card/${cardID}`, { cardTitle, cardDescription }));
    },

    async getCardsByColumnID(columnID) {
        return handleErrorAndReturnNull(apiClient.get(`/columns/${columnID}/cards`));
    },

    async deleteCard(cardID) {
        return handleErrorAndReturnNull(apiClient.delete(`/delete-card/${cardID}`));
    },

    async getMaxCardIndex(columnID) {
        return handleErrorAndReturnNull(apiClient.get(`columns/${columnID}/maxIndex`));
    },

    async move(cardID, columnID, prevCardIndex, nextCardIndex) {
        return handleErrorAndReturnNull(apiClient.post(`/cards/${cardID}/${columnID}/${prevCardIndex}/${nextCardIndex}/move`));
    },

};
