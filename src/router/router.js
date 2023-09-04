import { createRouter, createWebHistory } from 'vue-router';
import About from '../views/About.vue';
import Board from '../components/Board.vue';


const routes = [

    {
        path: '/about',
        name: 'About',
        component: About,
    },

    {
        path: '/',
        name: 'Board',
        component: Board,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
