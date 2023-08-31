<template>
    <div class="loading-spinner">
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
</template>

<script>
export default {
    name: 'LoadingSpinner',
};
</script>

<style scoped>
.loading-spinner {
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

.spinner {
    animation: rotate 2s linear infinite;
    width: 50px;
    height: 50px;
}

.path {
    stroke: hsl(210, 70%, 75%);
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
