import { createStore } from 'vuex';
const store = createStore({
    state() {
        return {
            columns: [],
        };
    },
    mutations: {
        ADD_COLUMN(state) {
            state.columns.push({
                key: Math.random() * 10,
                title: 'New List',
                cards: [],
            });
            console.log(state.columns);
        },
        UPDATE_COLUMN_TITLE(state, { columnKey, newTitle }) {
            const columnIndex = this.getters.getColumnByKey(columnKey);
            state.columns[columnIndex].title = newTitle;
        },
        DELETE_COLUMN(state, columnKey) {
            state.columns = state.columns.filter(
                (column) => column.key !== columnKey,
            );
        },
        ADD_CARD(state, columnKey) {
            const columnIndex = this.getters.getColumnByKey(columnKey);
            state.columns[columnIndex].cards.push({
                key: Math.random() * 10,
                title: 'New Card',
                description: '',
            });
        },
        UPDATE_CARD(state, { cardKey, columnKey, newTitle, newDescription }) {
            const columnIndex = this.getters.getColumnByKey(columnKey);
            const cardIndex = this.getters.getCardByKey(columnKey, cardKey);
            const card = state.columns[columnIndex].cards[cardIndex];
            card.title = newTitle;
            card.description = newDescription;
        },
        DELETE_CARD(state, { columnKey, cardKey }) {
            const columnIndex = this.getters.getColumnByKey(columnKey);

            state.columns[columnIndex].cards = state.columns[
                columnIndex
            ].cards.filter((card) => card.key !== cardKey);
        },
    },

    getters: {
        getColumnByKey: (state) => (columnKey) => {
            return state.columns.findIndex(
                (column) => column.key === columnKey,
            );
        },
        getCardByKey: (state) => (columnKey, cardKey) => {
            const columnIndex = state.columns.findIndex(
                (column) => column.key === columnKey,
            );
            return state.columns[columnIndex].cards.findIndex(
                (card) => card.key === cardKey,
            );
        },
        getCardsForColumn: (state) => (columnKey) => {
            const columnIndex = state.columns.findIndex(
                (column) => column.key === columnKey,
            );
            return state.columns[columnIndex].cards;
        },
    },

    actions: {},
});

export default store;
