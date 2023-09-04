<!-- eslint-disable vue/multi-word-component-names -->
<router-view></router-view>
<template>

    <div class="main-container">
        <header class="header-section">
            <span class="logo">Task Tracker</span>
            <nav>
                <router-link class="home-link" to="/">Home</router-link>
                <router-link class="about-link" to="/about">About</router-link>
            </nav>  
        </header>
        <div class="board-container">
            <div class="content-wrapper">
                <div class="column-container" @scroll="handleScroll">
                    <div class="column-cards">
                        <draggable
                            :list="getAllColumns"
                            group="columns"
                            :item-key="(column) => column.columnID"
                            ghost-class="ghost"
                            class="column-cards"
                            @change="onColumnChange">
                            <template #item="{ element: column }">
                                <Column :column="column">
                                    <draggable
                                        :list="getCardsByColumnID(column.columnID)"
                                        group="cards"
                                        :item-key="(card) => card.cardID"
                                        tag="ul"
                                        ghost-class="ghost"
                                        :data-column-id="column.columnID"
                                        @change="onCardChange"
                                        @end="onEnd">       
                                        <template #item="{ element: card }">
                                            <Card :card="card" :column="column" :url="setImageURL(card.cardID)">
                                                {{ card.cardTitle }}
                                            </Card>
                                        </template>
                                        
                                    </draggable>
                                </Column>   
                            </template>
                        </draggable>
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
            'MOVE_COLUMN',
            'SET_IMAGE',
        ]),
        ...mapMutations([
            'SET_LOADING',
            'SET_COLUMNS',
            'SET_CARDS',
            'SET_DROPDOWN_VISIBLE',
        ]),

        handleScroll() {
            this.SET_DROPDOWN_VISIBLE(false);
        },

        async onEnd(event) {
            const newColumnID = event.to.getAttribute('data-column-id');
            const cards = this.getCardsByColumnID(newColumnID);
            const { prevCardIndex, nextCardIndex } = this.calculateCardMoveIndexes(
                cards, 
                this.tempOldIndex, 
                this.tempNewIndex, 
                this.moveInSameColumn,
            );
            this.SET_LOADING(true);

            try {
                await this.MOVE_CARD({
                    cardID: this.tempCardID,
                    columnID: newColumnID,
                    prevCardIndex: prevCardIndex,
                    nextCardIndex: nextCardIndex,
                });
            } catch (error) {
                console.error('Error moving a card:', error);
            } finally {
                this.SET_LOADING(false);
            }
        },
        async setImageURL(cardID) {
            return await this.SET_IMAGE(cardID);
        },
        async onColumnChange(event) {
            const columnID = event.moved.element.columnID;
            const newColumnIndex = event.moved.newIndex;
            const columns = this.getAllColumns;

            const { prevColumnIndex, nextColumnIndex } = this.calculateColumnMoveIndexes(columns, newColumnIndex);

            this.SET_LOADING(true);

            try {
                await this.MOVE_COLUMN({
                    columnID: columnID,
                    prevColumnIndex: prevColumnIndex,
                    nextColumnIndex: nextColumnIndex,
                });
            } catch (error) {
                console.error('Error moving a column:', error);
            } finally {
                this.SET_LOADING(false);
            }
        },

        onCardChange(event) {
            let item = event.added || event.moved;
            if (!item) return;

            this.tempCardID = item.element.cardID;
            this.tempNewIndex = item.newIndex;
            this.tempOldIndex = item.oldIndex;
            event.moved
                ? (this.moveInSameColumn = true)
                : (this.moveInSameColumn = false);
        },

        calculateColumnMoveIndexes(columns, newColumnIndex) {
            let prevColumnIndex = 0;
            let nextColumnIndex = 0;

            if(newColumnIndex === 0) {
                nextColumnIndex = columns[newColumnIndex + 1].columnIndex;
            }
            else if(newColumnIndex === columns.length - 1) {
                prevColumnIndex = columns[newColumnIndex - 1].columnIndex;
            }
            else {
                prevColumnIndex = columns[newColumnIndex - 1].columnIndex;
                nextColumnIndex = columns[newColumnIndex + 1].columnIndex;
            }

            return { prevColumnIndex, nextColumnIndex };
        },

        calculateCardMoveIndexes(cards, oldCardIndex, newCardIndex, moveInSameColumn) {
            let prevCardIndex = 0;
            let nextCardIndex = 0;

            if (cards.length > 0) {
                //перемещение в рамках одной колонки
                if (moveInSameColumn) {
                    //перемещение в конец
                    if ((cards.length - 1) === newCardIndex) {
                        prevCardIndex = cards[newCardIndex].cardIndex;
                        nextCardIndex = 0;
                    }
                    //перемещение в начало
                    else if (newCardIndex === 0) {
                        prevCardIndex = 0;
                        nextCardIndex = cards[newCardIndex].cardIndex;
                    }
                    //пермещение между карточек вверх
                    else if (newCardIndex < oldCardIndex) {
                        prevCardIndex = cards[newCardIndex - 1].cardIndex;
                        nextCardIndex = cards[newCardIndex].cardIndex;

                    }
                    //пермещение между карточек вниз
                    else if (newCardIndex > oldCardIndex) {
                        prevCardIndex = cards[newCardIndex].cardIndex;
                        nextCardIndex = cards[newCardIndex + 1].cardIndex;
                    }
                }
                //перемещение в разные колонки

                //перемещение в начало
                else if (newCardIndex === 0) {
                    prevCardIndex = 0;
                    nextCardIndex = cards[newCardIndex].cardIndex;
                }
                //перемещение в конец
                else if (newCardIndex === cards.length) {
                    prevCardIndex = cards[cards.length - 1].cardIndex;
                    nextCardIndex = 0;
                }
                //пермещение между карточек
                else {
                    prevCardIndex = cards[newCardIndex - 1].cardIndex;
                    nextCardIndex = cards[newCardIndex].cardIndex;
                }

            }
            return { prevCardIndex, nextCardIndex };
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
nav {
    padding-top: 0.5rem;
}
.home-link, .about-link {
    font-size: 0.875rem;
    font-weight: 500;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    border-radius: 0.375rem;
    text-decoration: none;
}

.home-link:hover {
    background-color: #f3f4f6;
}

.about-link:hover {
    background-color: #f3f4f6;
}

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
    justify-content: space-between;
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
