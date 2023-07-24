<script setup>
import Header from './components/Header.vue';
import Drawer from './components/Drawer.vue';
import Board from './components/Board.vue';

</script>

<template>
    <v-app>
        <Header/>
        <Drawer/>
        <v-main>
            <Board/>
        </v-main>
    </v-app>
</template>
