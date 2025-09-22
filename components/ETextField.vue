<template>
  <div class="e-text-field">
    <label class="e-text-field__label"></label>
    <input class="e-text-field__input" />
    <slot name="message" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  id?: string // 若使用者有輸入，以使用者輸入的為主，若沒有請產出一個唯一 ID
  label?: string
  value?: string
  type?: string
  placeholder?: string
}
</script>
