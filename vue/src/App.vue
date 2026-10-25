<script setup lang="ts">
import CustomCursor from "./components/CustomCursor.vue";
import Preloader from './components/Preloader.vue'
</script>

<template>
  <Preloader />
  <RouterView />
  <CustomCursor />
</template>

