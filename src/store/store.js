import { createStore } from 'vuex';
import { serverlessRequests } from '../services/serverless-api/ServerlessApiService';
import { dockerRequests } from '../services/docker-api/DockerApiService';

const store = createStore({
    state() {
        return {
            columns: [],
            cards: [],
            isLoading: true,
            isButtonListVisible: false,
        };
    },
    mutations: {

        SET_COLUMNS(state, columns) {
            state.columns = columns;
        },

        SET_LOADING(state, isLoading) {
            state.isLoading = isLoading;
        },

        SET_DROPDOWN_VISIBLE(state, isButtonListVisible) {
            state.isButtonListVisible = isButtonListVisible;
        },

        SET_CARDS(state, cards) {
            state.cards = cards.sort((a, b) => a.cardIndex - b.cardIndex);
        },

        ADD_CARDS(state, cards, columnID) {
            const existingCards = state.cards.filter(card => card.columnID !== columnID);
            state.cards = [...existingCards, ...cards];
        },

        ADD_CARD(state, card) {
            state.cards.push(card);
        },

        ADD_COLUMN(state, column) {
            state.columns.push(column);
        },

        DELETE_CARD(state, cardID) {
            state.cards = state.cards.filter(card => card.cardID !== cardID);
        },

        DELETE_COLUMN(state, columnID) {
            state.columns = state.columns.filter(column => column.columnID !== columnID);
            state.cards = state.cards.filter(card => card.columnID !== columnID);
        },

        UPDATE_COLUMN(state, { columnID, columnTitle }) {
            const columnToUpdate = state.columns.find(column => column.columnID === columnID);
        
            if (columnToUpdate) {
                columnToUpdate.columnTitle = columnTitle;
            }
        },

        UPDATE_CARD(state, { cardID, cardTitle, cardDescription }) {
            const cardToUpdate = state.cards.find(card => card.cardID === cardID);
            
            if (cardToUpdate) {
                cardToUpdate.cardTitle = cardTitle;
                cardToUpdate.cardDescription = cardDescription;
            }

        },

        UPDATE_CARD_IMAGE(state, cardID) {
            const cardToUpdate = state.cards.find(card => card.cardID === cardID);

            if (cardToUpdate) {
                cardToUpdate.hasImage = true;
            }

        },

        MOVE_CARD(state, { cardID, columnID, cardIndex }) {
            const cardToMove = state.cards.find(card => card.cardID === cardID);
    
            if (cardToMove) {
                cardToMove.columnID = columnID;
                cardToMove.cardIndex = cardIndex;
            }
            state.cards.sort((a, b) => a.cardIndex - b.cardIndex);
        },

        MOVE_COLUMN(state, { columnID, columnIndex }) {
            const columnToMove = state.columns.find(column => column.columnID === columnID);
   
            if (columnToMove) {
                columnToMove.columnIndex = columnIndex;
            }
            state.columns.sort((a, b) => a.columnIndex - b.columnIndex);
        },
        
    },

    getters: {

        getAllColumns: (state) => {
            return state.columns;
        },

        getAllCards: (state) => {
            return state.cards;
        },

        getCardsByColumnID: (state) => (columnID) => {
            return state.cards
                .filter(card => card.columnID === columnID);
        },        

        isLoading: (state) => {
            return state.isLoading;
        },

        isButtonListVisible: (state) => {
            return state.isButtonListVisible;
        },
    },

    actions: {
        async GET_COLUMNS({ commit }) {
            try {
                const response = await serverlessRequests.getColumns();
                if (response && response.status === 200) {
                    commit('SET_COLUMNS', response.data.data);
                }
            } catch (error) {
                console.error('Error fetching columns:', error);
            }
        },
        
        async GET_CARDS_BY_COLUMN_ID({ commit }, columnID) {
            try {
                const response = await serverlessRequests.getCardsByColumnID(columnID);
                if (response && response.status === 200 && response.data.data.length > 0) { 
                    commit('ADD_CARDS', response.data.data, columnID);
                }
            } catch (error) {
                console.error('Error fetching cards by column ID:', error);
            }
        },
        
        async ADD_COLUMN({ commit }) {
            try {
                const response = await serverlessRequests.createColumn('Enter list name');
                if (response && response.status === 200) {
                    commit('ADD_COLUMN', response.data.data);
                }
            } catch (error) {
                console.error('Error adding column:', error);
            }
        },
        
        async ADD_CARD({ commit }, columnID) {
            try {
                const response = await serverlessRequests.createCard({ columnID, cardTitle: 'Press to edit' });
                if (response && response.status === 200) {
                    commit('ADD_CARD', response.data.data);
                }
            } catch (error) {
                console.error('Error adding card:', error);
            }
        },
        
        async DELETE_CARD({ commit }, cardID) {
            try {
                const response = await serverlessRequests.deleteCard(cardID);
                if (response && response.status === 200) {
                    commit('DELETE_CARD', cardID);
                }
            } catch (error) {
                console.error('Error deleting card:', error);
            }
        },
        
        async DELETE_COLUMN({ commit }, columnID) {
            try {
                const response = await serverlessRequests.deleteColumn(columnID);
                if (response && response.status === 200) {
                    commit('DELETE_COLUMN', columnID);
                }
            } catch (error) {
                console.error('Error deleting column:', error);
            }
        },
        
        async UPDATE_COLUMN({ commit }, { columnID, columnTitle }) {
            try {
                const response = await serverlessRequests.updateColumn(columnID, columnTitle);

                if (response && response.status === 200) {
                    commit('UPDATE_COLUMN', { columnID: response.data.data.columnID, columnTitle: response.data.data.columnTitle });
                }
            } catch (error) {
                console.error('Error updating column:', error);
            }
        },
        
        async UPDATE_CARD({ commit }, { cardTitle, cardID, cardDescription }) {
            try {
                const response = await serverlessRequests.updateCard(cardTitle, cardID, cardDescription);
                if (response && response.status === 200) {
                    commit('UPDATE_CARD', { cardID, cardTitle, cardDescription });
                }
            } catch (error) {
                console.error('Error updating card:', error);
            }
        },

        async UPDATE_CARD_IMAGE({ commit }, { cardID }) {
            try {
                const response = await serverlessRequests.updateCardImage(cardID);
                if (response && response.status === 200) {
                    commit('UPDATE_CARD_IMAGE', { cardID });
                }
            } catch (error) {
                console.error('Error updating card image:', error);
            }
        },

        async MOVE_CARD({ commit }, movedCard) { 
            try {
                const { cardID, columnID, prevCardIndex, nextCardIndex } = movedCard;
                const response = await serverlessRequests.moveCard(cardID, columnID, prevCardIndex, nextCardIndex);
                if(response && response.status === 200) {
                    const cardIndex = response.data.data.cardIndex;
                    commit('MOVE_CARD', { cardID, columnID, cardIndex });
                }
            } catch (error) {
                console.error('Error updating card:', error);
            }        
        },

        async MOVE_COLUMN({ commit }, movedColumn) { 
            try {
                const { columnID, prevColumnIndex, nextColumnIndex } = movedColumn;       

                const response = await serverlessRequests.moveColumn(columnID, prevColumnIndex, nextColumnIndex);
                if(response && response.status === 200)  {
                    const columnIndex = response.data.data.columnIndex;
                    commit('MOVE_COLUMN', { columnID, columnIndex });
                }
            } catch (error) {
                console.error('Error updating column:', error);
            }        
        },

        async UPLOAD_IMAGE({ commit }, { cardID, file }) {
            try {
                const response = await dockerRequests.getUploadImageURL(cardID, file.type);
                if(response) {
                    await dockerRequests.uploadFile(response.data.signedUrl, file);
                }
            } catch (error) {
                console.error('Error uploading an image:', error);
            }

        },

        async SET_IMAGE({ commit }, cardID) {
            try {
                const response = await dockerRequests.getImageURL(cardID);
                return response.data.signedUrl;
            } catch(error) {
                console.error('Error getting an image:', error);
            }
        },

        async DELETE_CARD_IMAGE({ commit }, cardID) {
            try {
                const response = await dockerRequests.getDeleteImageURL(cardID);
                if(response) {
                    await dockerRequests.deleteFile(response.data.signedUrl);
                }
            } catch(error) {
                console.error('Error deleting an image:', error);
            }
        },
        
    },
    
});

export default store;
