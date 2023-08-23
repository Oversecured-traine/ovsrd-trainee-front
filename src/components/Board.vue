<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="main-container">
        <header class="header-section">
            <span class="logo">Trello</span>
        </header>
        <div class="board-container">
            <div class="content-wrapper">
                <div class="column-container" @scroll="handleScroll">
                    <div class="column-cards">
                        <Column
                            v-for="column in getAllColumns"
                            :key="column.columnID"
                            :column="column"
                        >
                            <draggable
                                :list="getCardsByColumnID(column.columnID)"
                                group="cards"
                                :item-key="(card) => card.cardID"
                                tag="ul"
                                ghost-class="ghost"
                                :data-column-id=column.columnID
                                @change="onChange"
                                @end="onEnd"
                            >
                                <template #item="{ element }">
                                    <Card :card="element" :column="column">
                                        {{ element.cardTitle }}
                                    </Card>
                                </template>
                            </draggable>
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
import draggable from 'vuedraggable';

export default {
    components: {
        Column,
        Card,
        draggable,
    },
    data() {
        return {
            showModal: false,
            tempCardID: '',
            tempNewIndex: null,
            moveInSameColumn: false,
        };
    },
    computed: {
        ...mapGetters(['getAllColumns', 'getCardsByColumnID']),
    },
    methods: {
        ...mapActions([
            'GET_COLUMNS',
            'GET_CARDS_BY_COLUMN_ID',
            'ADD_COLUMN',
            'MOVE_CARD',
        ]),
        ...mapMutations(['SET_LOADING', 'SET_COLUMNS', 'SET_CARDS', 'SET_DROPDOWN_VISIBLE']),

        handleScroll() {
            this.SET_DROPDOWN_VISIBLE(false);
        },

        async onEnd(event) {
            const newColumnID = event.to.getAttribute('data-column-id');

            this.SET_LOADING(true);

            try {
                await this.MOVE_CARD({ cardID: this.tempCardID, columnID: newColumnID, newCardIndex: this.tempNewIndex, 
                                       moveInSameColumn: this.moveInSameColumn });

            } catch (error) {
                console.error('Error moving a card:', error);
            } finally {
                this.SET_LOADING(false);
            }

        },

        onChange(event) {
            let item = event.added || event.moved;
            if(!item) return;

            this.tempCardID = item.element.cardID;
            this.tempNewIndex = item.newIndex;
            event.moved ? this.moveInSameColumn = true : this.moveInSameColumn = false;
        },
        

        async fetchColumnsAndCards() {
            this.SET_LOADING(true);
            try {
                await this.GET_COLUMNS();

                for (const column of this.getAllColumns) {
                    await this.GET_CARDS_BY_COLUMN_ID(column.columnID);
                }
            } catch (error) {
                console.error('Error fetching columns or cards:', error);
            } finally {
                this.SET_LOADING(false);
            }
        },

        async addNewColumn() {
            try {
                this.SET_LOADING(true);
                await this.ADD_COLUMN();
            } catch (error) {
                console.error('Error fetching columns:', error);
            } finally {
                this.SET_LOADING(false);
            }
        },
    },
    async mounted() {
        this.SET_LOADING(true);
        this.SET_COLUMNS([]);
        this.SET_CARDS([]);
        await this.fetchColumnsAndCards();
    },
};
</script>

<style scoped>
ul {
    list-style-type: none;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}
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

.draggable {
    gap: 1rem;
    padding: 0 1rem 1rem;
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
