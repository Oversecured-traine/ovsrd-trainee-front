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
                            v-for="column in getAllColumns"
                            :key="column.columnID"
                            :column="column"
                        >
                            <Card
                                v-for="card in getCardsByColumnID(column.columnID)"
                                :key="card.cardID"
                                :card="card"
                                :column="column"
                            >
                                {{ card.cardTitle }}
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
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
    components: {
        Column,
        Card,
    },
    data() {
        return {
            showModal: false,
            isLoading: false,
        };
    },
    computed: {
        ...mapGetters(['getAllColumns', 'getCardsByColumnID']),
    },
    methods: {
        ...mapActions(['GET_COLUMNS', 'GET_CARDS_BY_COLUMN_ID', 'ADD_COLUMN']),
        ...mapMutations(['SET_LOADING']),

        async fetchColumnsAndCards() {

            this.SET_LOADING(true);
            try {
                await this.GET_COLUMNS();

                for (const column of this.getAllColumns) {
                    await this.GET_CARDS_BY_COLUMN_ID(column.columnID);
                }
            } 
            catch (error) {
                console.error('Error fetching columns or cards:', error);
            } 
            finally {
                this.SET_LOADING(false);
            }
        },

        async addNewColumn() {

            try {
                this.SET_LOADING(true);
                await this.ADD_COLUMN();
            } 
            catch (error) {
                console.error('Error fetching columns:', error);
            }
            finally {
                this.SET_LOADING(false);
            }

        },
    },
    async mounted() {
        
        await this.fetchColumnsAndCards();
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
    /* margin-left: 1rem; */
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
