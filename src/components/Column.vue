<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="column">
        <div class="column-title">
            <input type="text" v-model="title" @blur="editColumnTitle" />
            <v-menu offset-y>
                <template v-slot:activator="{ props }">
                    <button
                        class="column-actions-btn"
                        v-bind="props"
                        @click="handleClick"
                    >
                        <v-icon
                            icon="mdi-dots-horizontal"
                            size="small"
                        ></v-icon>
                    </button>
                </template>
                <v-list v-if="isButtonListVisible">
                    <v-list-item @click="deleteColumn">
                        <v-icon icon="mdi-delete" size="small"></v-icon>
                        Delete list
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
        <div class="card-list">
            <div class="scroll-section">
                <slot></slot>
            </div>
            <div class="add-btn-container">
                <button class="add-btn" @click="addNewCard">
                    <v-icon icon="mdi-plus"></v-icon>
                    <span style="margin-left: 0.25rem">Add Card</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
import { createToast } from 'mosha-vue-toastify';
import 'mosha-vue-toastify/dist/style.css';

export default {
    props: {
        column: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            title: this.column.columnTitle,
        };
    },

    computed: {
        ...mapGetters(['isButtonListVisible']),
    },

    methods: {
        ...mapActions([
            'GET_COLUMNS',
            'GET_CARDS_BY_COLUMN_ID',
            'ADD_COLUMN',
            'ADD_CARD',
            'DELETE_COLUMN',
            'UPDATE_COLUMN',
        ]),
        ...mapMutations(['SET_LOADING', 'SET_DROPDOWN_VISIBLE']),

        toast() {
            createToast(
                { title: 'Title cannot be empty' },
                { timeout: 3500, position: 'top-right', showIcon: true },
            );
        },

        handleClick() {
            this.SET_DROPDOWN_VISIBLE(true);
        },

        async deleteColumn() {
            try {
                this.SET_LOADING(true);
                await this.DELETE_COLUMN(this.column.columnID);
            } catch (error) {
                console.error('Error deleting a column:', error);
            } finally {
                this.SET_LOADING(false);
            }
        },

        async addNewCard() {
            try {
                this.SET_LOADING(true);
                await this.ADD_CARD(this.column.columnID);
            } catch (error) {
                console.error('Error adding a card:', error);
            } finally {
                this.SET_LOADING(false);
            }
        },

        async editColumnTitle(event) {
            try {
                const newTitle = event.target.value.trim();

                if (
                    newTitle.length === 0 ||
                    newTitle === this.column.columnTitle
                ) {
                    this.title = this.column.columnTitle;
                    if (newTitle.length === 0) {
                        this.toast();
                    }

                    return;
                }

                this.SET_LOADING(true);

                await this.UPDATE_COLUMN({
                    columnID: this.column.columnID,
                    columnTitle: newTitle,
                });

                this.title = newTitle;
            } catch (error) {
                console.error('Error updating a column:', error);
                this.title = this.column.columnTitle;
            } finally {
                this.SET_LOADING(false);
            }
        },
    },
};
</script>

<style scoped>
.column {
    width: 18rem;
    background-color: #f1f2f4;
    display: flex;
    flex-direction: column;
    border-radius: 0.375rem;
    max-height: 100%;
}

.column-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
}

.column-actions-btn {
    background-color: transparent;
    width: 2rem;
    height: 2rem;
    border-radius: 0.375rem;
    place-content: center;
}

.column-actions-btn:hover {
    background-color: #c8ccd3;
}

.card-list {
    padding: 0 0.75rem 0.75rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.scroll-section {
    overflow-y: auto;
    flex: 1;
    padding-left: 0.25rem;
    padding-right: 0.75rem;
    border-top: solid thin #D9CDFC;
    border-bottom: solid thin #D9CDFC;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;

}

.add-btn {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #718096;
    border-radius: 0.375rem;
    transition: background-color 0.3s, color 0.3s;
    width: 100%;
}

.add-btn:hover {
    background-color: #edf2f7;
    color: #000;
}

.add-btn-container {
    margin-top: 0.75rem;
}

input {
    font-size: 1rem;
    font-weight: 600;
    color: #4a5568;
    padding: 0.3rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
