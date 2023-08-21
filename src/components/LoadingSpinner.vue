<template>
    <div class="container">
        <header class="header-section">
            <span class="logo">Trello</span>
        </header>
        <div class="content">
            <svg class="spinner" viewBox="0 0 50 50">
                <circle
                    class="path"
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    stroke-width="5"
                ></circle>
            </svg>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'LoadingSpinner',
    computed: {
        ...mapGetters(['isLoading']),
    },
};
</script>

<style scoped lang="scss">
.container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: linear-gradient(#3b82f6, #8f31ed);
}

.content {
position: fixed; 
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000; 
}

.header-section {
    flex-shrink: 0;
    display: flex;
    background-color: #ffffff;
    padding: 0.75rem 1rem;
}
.logo {
    font-size: 1.75rem;
    font-weight: 900;
    letter-spacing: -0.05rem;
}

.spinner {
    animation: rotate 2s linear infinite;
    z-index: 2;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -25px 0 0 -25px;
    width: 50px;
    height: 50px;
}

.path {
        stroke: hsl(210, 70, 75);
        stroke-linecap: round;
        animation: dash 1.5s ease-in-out infinite;
    }

@keyframes rotate {
    100% {
        transform: rotate(360deg);
    }
}

@keyframes dash {
    0% {
        stroke-dasharray: 1, 150;
        stroke-dashoffset: 0;
    }
    50% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -35;
    }
    100% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -124;
    }
}
</style>
