<template>
  <div style="margin-top: 2rem">Home</div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  msg: String
})

const count = ref(0)
</script>

<style scoped>
</style>
