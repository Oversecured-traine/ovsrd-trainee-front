<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="column">
        <div class="column-title">
            <input @input="editColumnTitle($event)" placeholder="Enter list name"> 
            <!--Dropdown Menu-->           
            <v-menu offset-y>
                <template v-slot:activator="{ props }">
                    <button class="column-actions-btn" v-bind="props">
                        <v-icon icon="mdi-dots-horizontal" size="small"></v-icon>
                    </button>
                </template>
                <v-list>
                    <v-list-item @click="deleteColumn">
                        <v-icon icon="mdi-delete" size="small"></v-icon>
                        Delete list                       
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
        <div class="card-list">
            <div class="scroll-section">
                <ul>
                    <slot></slot>
                </ul>
            </div>
            <div class="add-btn-container">
                <button class="add-btn" @click="addCard">
                    <v-icon icon="mdi-plus"></v-icon>
                    <span style="margin-left: 0.25rem">Add Card</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        column: Object,
    },
    methods: {
        addCard() {
            this.$emit('add-card', this.column.key);
        },

        editColumnTitle(event) {
            this.$emit(
                'update-column-title',
                this.column.key,
                event.target.value,
            );
        },

        deleteColumn() {
            this.$emit('delete-column', this.column.key);
        },
        
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

.column {
    width: 18rem;
    background-color: #cbd5e0;
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
}
</style>
