import { createStore } from 'vuex';
import { apiRequests } from '../services/api/api-service';

const store = createStore({
    state() {
        return {
            columns: [],
            cards: [],
            isLoading: true,
        };
    },
    mutations: {
        SET_COLUMNS(state, columns) {
            state.columns = columns;
        },

        SET_LOADING(state, isLoading) {
            state.isLoading = isLoading;
        },

        SET_CARDS(state, cards) {
            state.cards = cards;
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
        },

        UPDATE_COLUMN(state, columnID, columnTitle) {
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

            console.log('CARD IN MATATION', cardToUpdate);


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
            return state.cards.filter(card => card.columnID === columnID);
        },

        isLoading: (state) => {
            return state.isLoading;
        },
    },

    actions: {
        async GET_COLUMNS({ commit }) {
            try {
                const columns = await apiRequests.getColumns();
                if (columns) {
                    commit('SET_COLUMNS', columns);
                }
            } catch (error) {
                console.error('Error fetching columns:', error);
            }
        },

        async GET_CARDS_BY_COLUMN_ID({ commit }, columnID) {

            const cards = await apiRequests.getCardsByColumnID(columnID);

            if (cards.length > 0) { 
                commit('ADD_CARDS', cards, columnID);
                return cards;
            }
            return null;
        },

        async ADD_COLUMN({ commit }) {

            const column = await apiRequests.createColumn('Enter list name');

            console.log('COLUMN', column);

            if (column !== null) {
                commit('ADD_COLUMN', column);
                return column;
            }
            return null;
        },

        async ADD_CARD({ commit }, columnID) {

            const card = await apiRequests.createCard({ columnID: columnID, cardTitle: 'Press to edit' });

            console.log('CARD ACTION', card);

            if (card !== null) {
                commit('ADD_CARD', card);
                return card;
            }
            return null;
        },

        async DELETE_CARD({ commit }, cardID) {

            const card = await apiRequests.deleteCard(cardID);

            console.log('CARD', card);

            if (card !== null) {
                commit('DELETE_CARD', cardID);
                return card;
            }
            return null;
        },

        async DELETE_COLUMN({ commit }, columnID) {

            const column = await apiRequests.deleteColumn(columnID);

            if (column !== null) {
                commit('DELETE_COLUMN', columnID);
                return column;
            }
            return null;
        },

        async UPDATE_COLUMN({ commit }, {columnID, columnTitle}) {

            const column = await apiRequests.updateColumn(columnID, columnTitle);

            if (column !== null) {
                commit('UPDATE_COLUMN', { columnID, columnTitle });
                return column;
            }
            return null;
        },

        async UPDATE_CARD({ commit }, { cardTitle, cardID, cardDescription }) {

            const card = await apiRequests.updateCard(cardTitle, cardID, cardDescription);
            console.log('CARD IN ACTION', card);
            if (card !== null) {
                commit('UPDATE_CARD', { cardID, cardTitle, cardDescription });
                return card;
            }
            return null;
        },
    },
    
});

export default store;
