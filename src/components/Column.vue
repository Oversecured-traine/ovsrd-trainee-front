<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-col :key="columnIndex" class="column">
        <h3 contenteditable @input="editColumnTitle($event)">
            {{ columnCopy.title }}
        </h3>
        <v-row>
            <v-col
                class="card-column">
                <Card
                    v-for="(card, cardIndex) in columnCopy.cards"
                    :key="cardIndex"
                    :card="card"
                    :card-index="cardIndex"
                    @edit-card="editCard(cardIndex, card)"
                    @delete-card="deleteCard(cardIndex)"
                />
            </v-col>
            <v-col class="text-right">
                <v-btn color="primary" depressed @click="addCard">Add Card</v-btn>
                <v-btn
                    icon="mdi-delete-outline"
                    variant="text"
                    @click="deleteColumn"
                ></v-btn>
            </v-col>
        </v-row>
    </v-col>
</template>

<script>
import Card from './Card.vue';

export default {
    components: {
        Card,
    },
    props: {
        column: Object,
        columnIndex: Number,
    },
    data() {
        return {
            columnCopy: {},
        };
    },
    watch: {
        column: {
            handler(newVal) {
                this.columnCopy = JSON.parse(JSON.stringify(newVal));
            },
            immediate: true,
        },
    },
    methods: {
        editColumnTitle(event) {
            const title = event.target.innerText;
            this.$emit('update-column-title', this.columnIndex, title);
        },
        addCard() {
            this.columnCopy.cards.push({
                cardIndex: this.columnCopy.cards.length,
                title: 'New Card',
                description: '',
            });
        },
        editCard(cardIndex, updatedCard) {
            this.columnCopy.cards.splice(cardIndex, 1, updatedCard);
        },
        deleteColumn() {
            this.$emit('delete-column');
        },
        deleteCard(cardIndex) {
            this.columnCopy.cards.splice(cardIndex, 1);
        },
    },
};
</script>

<style scoped>
.column {
    width: 320px;
    padding: 10px;
    background-color: #f5f5f5;
    border-radius: 5px;
    margin-right: 10px;
}

</style>
