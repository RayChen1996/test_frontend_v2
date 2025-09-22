<template>
  <button class="e-btn"></button>
</template>

<script setup lang="ts">
interface Props {
  text?: string // 若有輸入時以此為主，若沒有就顯示 slot
  color?: 'success' | 'error' | 'warn' // 預設為 success
  disabled?: boolean
}
</script>

<style scoped lang="scss">
.e-btn {
  appearance: none;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.05s ease,
    opacity 0.2s ease;
  user-select: none;
  line-height: 1;

  &.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &-success {
    background-color: #10b981;
    color: #fff;
    &:hover {
      background-color: #0ea371;
    }
    &:active {
      transform: translateY(1px);
    }
  }

  &-error {
    background-color: #ef4444;
    color: #fff;
    &:hover {
      background-color: #d93c3c;
    }
    &:active {
      transform: translateY(1px);
    }
  }

  &-warn {
    background-color: #f59e0b;
    color: #111827;
    &:hover {
      background-color: #de8f09;
    }
    &:active {
      transform: translateY(1px);
    }
  }
}
</style>
