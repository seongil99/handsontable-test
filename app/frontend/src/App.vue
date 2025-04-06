<script setup lang="ts">
import HotTable from './components/HotTable.vue'
</script>

<template>
  <div class="app-container">
    <h1>Handsontable Test</h1>
    <Suspense>
      <!-- 기본 컨텐츠 -->
      <HotTable />

      <!-- 로딩 상태 -->
      <template #fallback>
        <div>Loading Table with Suspense...</div>
      </template>
    </Suspense>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  justify-content: center;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
