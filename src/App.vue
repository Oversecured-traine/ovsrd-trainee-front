<template>
    <v-app>
        <v-main>
            <router-view/>
            <!-- <LoadingSpinner v-if="isLoading"/> -->
        </v-main>
    </v-app>
</template>

<script>
import LoadingSpinner from './components/LoadingSpinner.vue';
import { mapGetters } from 'vuex';
export default {
    components: {
        // LoadingSpinner,
    },
    computed: {
        ...mapGetters(['isLoading']),
    }, 

};

</script>

