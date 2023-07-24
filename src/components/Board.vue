<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="board-container">
        <v-container fluid>
            <div class="board-row" :style="{ width: rowWidth }">
                <Column
                    v-for="(column, columnIndex) in columns"
                    :key="columnIndex"
                    :column="column"
                    :column-index="columnIndex"
                    @update-column-title="updateColumnTitle"
                    @delete-column="deleteColumn(columnIndex)"
                />
                <v-col>
                    <v-btn color="primary" depressed @click="addColumn">Add</v-btn>
                </v-col>
            </div>
        </v-container>
    </div>
</template>
  
<script>
import Column from './Column.vue';
  
export default {
    components: {
        Column,
    },
    data() {
        return {
            columns: [],
        };
    },
    computed: {
        rowWidth() {
            return `${this.columns.length * 320}px`;
        },
    },
    methods: {
        addColumn() {
            this.columns.push({
                columnIndex: this.columns.length,
                title: 'New Column',
                cards: [],
            });
        },
        updateColumnTitle(columnIndex, title) {
            this.columns[columnIndex].title = title;

        },
        deleteColumn(columnIndex) {
            this.columns.splice(columnIndex, 1);
        },
    },
};
</script>
  
  <style scoped>
  .board-container {
    overflow-x: auto;
    white-space: nowrap;
  }
  
  .board-row {
    display: flex;
  }

  </style>
  