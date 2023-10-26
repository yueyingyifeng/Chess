<script setup lang="ts">

const props = defineProps(
  ['id']
)

</script>

<template>
  <div>
    <text>房价号:</text><button>{{ id }}</button>
  </div>
</template>

<style scoped>

</style>
