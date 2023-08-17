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

            const card = await apiRequests.createCard('Press to edit', columnID );

            console.log('CARD', card);

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

            console.log('CARD', column);

            if (column !== null) {
                commit('DELETE_COLUMN', columnID);
                return column;
            }
            return null;
        },
    },
    
});

export default store;
