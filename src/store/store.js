import { createStore } from 'vuex';
import { apiRequests } from '../services/api/api-service';

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
            console.log('cards', cards);
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
                const response = await apiRequests.getColumns();
                if (response && response.status === 200) {
                    commit('SET_COLUMNS', response.data.data);
                }
            } catch (error) {
                console.error('Error fetching columns:', error);
            }
        },
        
        async GET_CARDS_BY_COLUMN_ID({ commit }, columnID) {
            try {
                const response = await apiRequests.getCardsByColumnID(columnID);
                if (response && response.status === 200 && response.data.data.length > 0) { 
                    commit('ADD_CARDS', response.data.data, columnID);
                }
            } catch (error) {
                console.error('Error fetching cards by column ID:', error);
            }
        },
        
        async ADD_COLUMN({ commit }) {
            try {
                const response = await apiRequests.createColumn('Enter list name');
                if (response && response.status === 200) {
                    commit('ADD_COLUMN', response.data.data);
                }
            } catch (error) {
                console.error('Error adding column:', error);
            }
        },
        
        async ADD_CARD({ commit }, columnID) {
            try {
                const response = await apiRequests.createCard({ columnID, cardTitle: 'Press to edit' });
                if (response && response.status === 200) {
                    commit('ADD_CARD', response.data.data);
                }
            } catch (error) {
                console.error('Error adding card:', error);
            }
        },
        
        async DELETE_CARD({ commit }, cardID) {
            try {
                const response = await apiRequests.deleteCard(cardID);
                if (response && response.status === 200) {
                    commit('DELETE_CARD', cardID);
                }
            } catch (error) {
                console.error('Error deleting card:', error);
            }
        },
        
        async DELETE_COLUMN({ commit }, columnID) {
            try {
                const response = await apiRequests.deleteColumn(columnID);
                if (response && response.status === 200) {
                    commit('DELETE_COLUMN', columnID);
                }
            } catch (error) {
                console.error('Error deleting column:', error);
            }
        },
        
        async UPDATE_COLUMN({ commit }, { columnID, columnTitle }) {
            try {
                const response = await apiRequests.updateColumn(columnID, columnTitle);

                if (response && response.status === 200) {
                    commit('UPDATE_COLUMN', { columnID: response.data.data.columnID, columnTitle: response.data.data.columnTitle });
                }
            } catch (error) {
                console.error('Error updating column:', error);
            }
        },
        
        async UPDATE_CARD({ commit }, { cardTitle, cardID, cardDescription }) {
            try {
                const response = await apiRequests.updateCard(cardTitle, cardID, cardDescription);
                if (response && response.status === 200) {
                    commit('UPDATE_CARD', { cardID, cardTitle, cardDescription });
                }
            } catch (error) {
                console.error('Error updating card:', error);
            }
        },

        async MOVE_CARD({ commit, getters }, item) {
    
            try {
                const { cardID, columnID, newCardIndex, moveInSameColumn } = item;               
                const cards = getters.getCardsByColumnID(columnID);
                let prevCardIndex = 0;
                let nextCardIndex = 0;

                if(cards.length === 0) {

                    prevCardIndex = 0;
                    nextCardIndex = 0;
                }
                else if(cards.length > 0) {

                    if(newCardIndex === 0) {
                        prevCardIndex = 0;
                        nextCardIndex = cards[newCardIndex].cardIndex;
                    }
                    else if(moveInSameColumn && newCardIndex === cards.length - 1) {
                        prevCardIndex = cards[cards.length - 1].cardIndex;
                        nextCardIndex = 0;
                    }
                    else if(newCardIndex === cards.length) {
                        prevCardIndex = cards[cards.length - 1].cardIndex;
                        nextCardIndex = 0;

                    }
                    else {
                        prevCardIndex = cards[newCardIndex - 1].cardIndex;
                        nextCardIndex = cards[newCardIndex].cardIndex;
                    }
                }
                const response = await apiRequests.moveCard(cardID, columnID, prevCardIndex, nextCardIndex);
                if(response && response.status === 200) {
                    const cardIndex = response.data.data.cardIndex;
                    commit('MOVE_CARD', { cardID, columnID, cardIndex });
                }
            } catch (error) {
                console.error('Error updating card:', error);
            }        
        },

        async MOVE_COLUMN({ commit, getters }, item) {
    
            try {
                const { columnID, newColumnIndex } = item;       
                const columns = getters.getAllColumns;
                let prevColumnIndex = 0;
                let nextColumnIndex = 0;

                if(newColumnIndex === 0) {
                    prevColumnIndex = 0;
                    nextColumnIndex = columns[newColumnIndex + 1].columnIndex;
                }
                else if(newColumnIndex === columns.length - 1) {
                    prevColumnIndex = columns[newColumnIndex - 1].columnIndex;
                    nextColumnIndex = 0;

                }
                else {
                    prevColumnIndex = columns[newColumnIndex - 1].columnIndex;
                    nextColumnIndex = columns[newColumnIndex + 1].columnIndex;
                }
                const response = await apiRequests.moveColumn(columnID, prevColumnIndex, nextColumnIndex);
                if(response && response.status === 200)  {
                    const columnIndex = response.data.data.columnIndex;
                    commit('MOVE_COLUMN', { columnID, columnIndex });
                }
            } catch (error) {
                console.error('Error updating column:', error);
            }        
        },
        
    },
    
});

export default store;
