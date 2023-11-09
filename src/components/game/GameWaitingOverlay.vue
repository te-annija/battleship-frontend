<!-- 
  FILENAME: GameWaitingOverlay.vue
  DESCRIPTION: The component renders an overlay over game container to display that player should wait for the opponent to join.
  AUTHOR: Annija Karitone 
-->
<template>
  <div class="waiting__overlay">
    <div class="waiting__overlay-spinner"></div>
    <p>Waiting for the opponent to join...</p>
  </div>
</template>

<style lang="scss" scoped>
.waiting__overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  color: white;

  &-spinner {
    border: 5px solid rgba(255, 255, 255, 0.4);
    border-top: 4px solid #b4b4ff;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 2s linear infinite;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
