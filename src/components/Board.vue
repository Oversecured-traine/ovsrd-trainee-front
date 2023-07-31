<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="main-container">
        <header class="header-section">
            <span class="logo">Trello</span>
        </header>
        <div class="board-container">
            <div class="content-wrapper">
                <div class="column-container">
                    <div class="column-cards">
                        <Column
                            v-for="column in columns"
                            :key="column.key"
                            :column="column"
                            @update-column-title="onUpdateColumnTitle"
                            @add-card="addNewCard"
                            @delete-column="onDeleteColumn">
                            <Card
                                v-for="card in columns[this.getColumnIndex(column.key)].cards"
                                :key="card.key"
                                :card="card"
                                :column="column"
                                @delete-card="onDeleteCard"
                                @save-card="onSaveCard">
                                {{ card.title }}
                            </Card>
                        </Column>
                        <div class="add-another-column">
                            <button
                                class="add-another-column-btn"
                                @click="addNewColumn">
                                <v-icon icon="mdi-plus"></v-icon>
                                <span style="margin-left: 0.25rem">Add another list</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Column from './Column.vue';
import Card from './Card.vue';

export default {
    components: {
        Column,
        Card,
        
    },
    data() {
        return {
            columns: [],
            showModal: false,
        };
    },
    methods: {
        addNewColumn() {
            this.columns.push({
                key: Math.random() * 10,
                title: 'New List',
                cards: [],
            });
        },

        addNewCard(columnKey) {
            this.columns[this.getColumnIndex(columnKey)].cards.push(
                { 
                    key: Math.random() * 10, 
                    title: 'New Card', 
                    description: '' ,
                });
            
        },

        onDeleteCard(cardKey, columnKey) {
            let columnIndex = this.getColumnIndex(columnKey);
            let cardIndex = this.getCardIndex(columnIndex, cardKey);
            this.columns[columnIndex].cards.splice(cardIndex, 1);
        },

        onDeleteColumn(columnKey) {
            const columnIndex = this.getColumnIndex(columnKey);
            this.columns.splice(columnIndex, 1);
        },

        onUpdateColumnTitle(columnKey, title) {
            let columnIndex = this.getColumnIndex(columnKey);
            this.columns[columnIndex].title = title;
        },

        getColumnIndex(columnKey) {
            return this.columns.findIndex(column => column.key === columnKey);
        },

        getCardIndex(columnIndex, cardKey) {
            return this.columns[columnIndex].cards .findIndex(card => card.key === cardKey);
        },

        onSaveCard(cardKey, columnKey, newTitle, newDescription) {
            let columnIndex = this.getColumnIndex(columnKey);
            let cardIndex = this.getCardIndex(columnIndex, cardKey);
            let card = this.columns[columnIndex].cards[cardIndex];
            card.title = newTitle;
            card.description = newDescription;
        },
    },
};
</script>

<style scoped>
.main-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: linear-gradient(#3b82f6, #8f31ed);
}

.board-container {
    flex: 1;
    overflow: hidden;
}

.content-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.header-section {
    flex-shrink: 0;
    display: flex;
    background-color: #ffffff;
    padding: 0.75rem 1rem;
}

.logo {
    font-size: 1.75rem;
    font-weight: 900;
    letter-spacing: -0.05rem;
}

h1 {
    font-size: 1.5rem;
    color: #fff;
    font-weight: bold;
}

.column-container {
    flex: 1;
    overflow-x: auto;
    padding: 1rem;
}

.column-cards {
    display: inline-flex;
    height: 100%;
    align-items: flex-start;
    padding: 0 1rem 1rem;
    margin-left: 1rem;
    gap: 1rem;
}

.add-another-column {
    width: 18rem;
}

.add-another-column-btn {
    display: flex;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.1);
    width: 100%;
    color: #fff;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 0.375rem;
}

.add-another-column-btn:hover {
    background-color: rgba(255, 255, 255, 0.2);
}
</style>
