<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <li>
        <div class="card-item" @click="openModal = true">
            <h4>
                <slot> </slot>
            </h4>
        </div>
        <div class="delete-card-btn-container">
            <button @click="deleteCard" class="delete-card-btn">
                <v-icon icon="mdi-archive" size="x-small"></v-icon>
            </button>
        </div>
        <!--Modal Window -->
        <v-dialog v-model="openModal" max-width="500">
            <v-card>
                <v-card-title>
                    <span class="headline">Edit Card</span>
                </v-card-title>
                <v-card-text>
                    <v-text-field
                        label="Title"
                        v-model="newTitle">
                    </v-text-field>
                    <v-textarea
                        label="Description"
                        v-model="newDescription">
                    </v-textarea>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="openModal = false">Close</v-btn
                    >
                    <v-btn color="primary" text @click="saveCard">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </li>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';

export default {
    data() {
        return {
            openModal: false,
            newTitle: this.card.cardTitle,
            newDescription: this.card.cardDescription,
        };
    },
    props: {
        card: Object,
        column: Object,
    },
    methods: {
        ...mapActions([
            'GET_COLUMNS',
            'GET_CARDS_BY_COLUMN_ID',
            'ADD_COLUMN',
            'ADD_CARD',
            'DELETE_CARD',
            'UPDATE_CARD',

        ]),
        ...mapMutations(['SET_LOADING']),

        async deleteCard() {
            try {
                this.SET_LOADING(true);

                await this.DELETE_CARD(this.card.cardID);
            } 
            catch (error) {
                console.error('Error deleting a card:', error);
            }

            finally {
                this.SET_LOADING(false);
            }
        },

        async saveCard() {
            try {
                this.openModal = false;
                this.SET_LOADING(true);

                const updatedCard = {
                    cardID: this.card.cardID,
                    cardTitle: this.newTitle,
                    cardDescription: this.newDescription,
                };

                console.log('THIS CARD WILL BE SAVED', updatedCard);

                await this.UPDATE_CARD(updatedCard);

            } 
            catch (error) {
                console.error('Error updating a card:', error);
            } 
            finally {
                this.SET_LOADING(false);
            }
        },
    },
};
</script>

<style scoped>
h4 {
    padding: 0.3rem;
    color: #4a5568;
}

.card-item {
    font-size: 0.875rem;
}

li {
    position: relative;
    background-color: #fff;
    padding: 0.75rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    border-radius: 0.375rem;
    border-bottom-width: 1px;
    border-color: #e2e8f0;
}

li:hover {
    background-color: #f7fafc;
}

.delete-card-btn {
    display: none;
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    width: 2rem;
    height: 2rem;
    background-color: #f7fafc;
    place-content: center;
    border-radius: 0.375rem;
    color: #718096;
}

.delete-card-btn:hover {
    background-color: #edf2f7;
}
li:hover .delete-card-btn {
    display: grid;
}
</style>
