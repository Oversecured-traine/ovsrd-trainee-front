<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-card class="card">
        <v-card-title @click="openModal">{{ cardCopy.title }}</v-card-title>
        <v-btn
            icon="mdi-trash-can-outline"
            variant="text"
            @click="deleteCard"
        ></v-btn>
        <v-dialog v-model="showModal" max-width="500">
            <v-card>
                <v-card-title>
                    <span class="headline">Edit Card</span>
                </v-card-title>
                <v-card-text>
                    <v-text-field
                        v-model="cardCopy.title"
                        label="Title"
                    ></v-text-field>
                    <v-textarea
                        v-model="cardCopy.description"
                        label="Description"
                    ></v-textarea>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="closeModal">Close</v-btn>
                    <v-btn color="primary" text @click="saveCard">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
export default {
    props: {
        card: Object,
        cardIndex: Number,
    },
    data() {
        return {
            cardCopy: {},
            showModal: false,
        };
    },
    watch: {
        card: {
            handler(newVal) {
                this.cardCopy = JSON.parse(JSON.stringify(newVal)); 
            },
            immediate: true,
        },
    },

    methods: {
        openModal() {
            this.showModal = true;
        },
        deleteCard() {
            this.$emit('delete-card', this.cardCopy);
        },
        saveCard() {
            this.$emit('edit-card', this.cardCopy);
            this.showModal = false;
        },
        closeModal() {
            this.showModal = false;
        },
    },
};
</script>

<style scoped>
.card {
    margin-bottom: 10px;
    width: 100%;

}
</style>
