<template>
    <v-app>

        <v-main>
            <LoadingSpinner v-if="isLoading"/>
            <Board/>
        </v-main>
    </v-app>
</template>

<script>
import Board from './components/Board.vue';
import LoadingSpinner from './components/LoadingSpinner.vue';
import { mapGetters } from 'vuex';
export default {
    components: {
        Board,
        LoadingSpinner,
    },
    computed: {
        ...mapGetters(['isLoading']),
    }, 

};

</script>

