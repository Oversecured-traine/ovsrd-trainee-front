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
                        >
                            <Card
                                v-for="card in cards(column.key)"
                                :key="card.key"
                                :card="card"
                                :column="column"
                            >
                                {{ card.title }}
                            </Card>
                        </Column>
                        <div class="add-another-column">
                            <button
                                class="add-another-column-btn"
                                @click="addNewColumn"
                            >
                                <v-icon icon="mdi-plus"></v-icon>
                                <span style="margin-left: 0.25rem">Add another list</span
                                >
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
            showModal: false,
        };
    },
    computed: {
        columns() {
            return this.$store.state.columns;
        },
        cards() {
            return this.$store.getters.getCardsForColumn;
        },
    },
    methods: {
        addNewColumn() {
            this.$store.commit('ADD_COLUMN');
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
