import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://00jmg9ex3k.execute-api.eu-west-1.amazonaws.com/dev',
    timeout: 10000,
});

export const apiRequests = {

    // Column requests
    async getColumns() {
        try {
            const response = await apiClient.get('/columns');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching columns:', error);
            return null;
        }
    },

    async createColumn(columnTitle) {
        try {
            const response = await apiClient.post('/create-column', { columnTitle: columnTitle });
            return response;
        } catch (error) {
            console.error('Error creating a column:', error);
            return null;
        }
    },

    async getColumnByID(columnID) {
        try {
            const response = await apiClient.get(`/get-column/${columnID}`);
            return response.data.data;
        } catch (error) {
            console.error('Error getting a column:', error);
            return null;
        }
    },

    async updateColumn(columnID, columnTitle) {
        try {
            const response = await apiClient.put(`/update-columns/${columnID}`, { columnTitle: columnTitle  });
            return response;
        } catch (error) {
            console.error('Error updating a column:', error);
            return null;
        }
    },

    async deleteColumn(columnID) {
        try {
            const response = await apiClient.delete(`/delete-columns/${columnID}`);
            return response;
        } catch (error) {
            console.error('Error deleting a column:', error);
            return null;
        }
    },

    async getMaxColumnIndex() {
        try {
            const response = await apiClient.get('columns/maxIndex');
            return response.data.data;
        } catch (error) {
            console.error('Error getting a max column index:', error);
            return null;
        }
    },

    // Card requests
    async getCards() {
        try {
            const response = await apiClient.get('/cards');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching cards:', error);
            return null;
        }
    },

    async createCard({ columnID, cardTitle }) {

        console.log('columnID', columnID);
        console.log('title', cardTitle);

        try {
            const response = await apiClient.post(`/create-card/${columnID}`, { cardTitle: cardTitle });
            console.log('RESPONSE', response);
            return response.data.data;
        } catch (error) {
            console.error('Error creating a card:', error);
            return null;
        }
    },

    async getCardByID(cardID) {
        try {
            const response = await apiClient.get(`/get-card/${cardID}`);
            return response.data.data;
        } catch (error) {
            console.error('Error getting a card:', error);
            return null;
        }
    },

    async updateCard(cardTitle, cardID, cardDescription) {
        try {
            const response = await apiClient.put(`/update-card/${cardID}`, { cardTitle: cardTitle , cardDescription: cardDescription  });
            console.log('RESPONSE UPDATE CARD', response.data.data);
            return response.data.data;
        } catch (error) {
            console.error('Error updating a card:', error);
            return null;
        }
    },

    async getCardsByColumnID(columnID) {
        try {
            const response = await apiClient.get(`/columns/${columnID}/cards`);
            return response.data.data;
        } catch (error) {
            console.error('Error getting cards:', error);
            return null;
        }
    },

    async deleteCard(cardID) {
        try {
            const response = await apiClient.delete(`/delete-card/${cardID}`);
            return response;
        } catch (error) {
            console.error('Error deleting a card:', error);
            return null;
        }
    },

    async getMaxCardIndex(columnID) {
        try {
            const response = await apiClient.get(`columns/${columnID}/maxIndex`);
            return response.data.data;
        } catch (error) {
            console.error('Error getting max card index:', error);
            return null;
        }
    },

    async move(cardID, columnID, prevCardIndex, nextCardIndex) {
        try {
            const response = await apiClient.post(`/cards/${cardID}/${columnID}/${prevCardIndex}/${nextCardIndex}/move`);
            return response.data.data;
        } catch (error) {
            console.error('Error moving a card:', error);
            return null;
        }
    },

};

