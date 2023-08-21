<template>
    <v-app>

        <v-main>
<<<<<<< HEAD
            <LoadingSpinner v-if="isLoading"/>
=======
>>>>>>> dev
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

