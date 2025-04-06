<template>
  <div class="hot-table-container">
    <div id="hot-table" ref="hotTableContainer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import Handsontable from 'handsontable'
import 'handsontable/dist/handsontable.full.css'
import axios from 'axios'

// Vue 래퍼 컴포넌트 대신 직접 Handsontable 인스턴스 관리
const hotTableContainer = ref<HTMLElement | null>(null)
const hotInstance = ref<Handsontable | null>(null)

const tableState = reactive({
  data: [] as any[][],
  colWidths: Array(10).fill(50) as number[], // 기본값으로 초기화
  rowHeights: Array(10).fill(23) as number[], // 기본값으로 초기화
})

// 네이티브 Handsontable 이벤트 핸들러
const registerEvents = () => {
  if (!hotInstance.value) return;
  
  hotInstance.value.addHook('afterColumnResize', 
    (currentColumn: number, newSize: number) => {
      console.log(`Column ${currentColumn} resized to ${newSize}`);
      
      // 새로운 방식: 전체 열 너비 배열을 가져와서 저장
      const allColWidths: number[] = [];
      const numCols = hotInstance.value?.countCols() ?? 0;
      
      for (let i = 0; i < numCols; i++) {
        // getColWidth는 해당 열의 현재 너비를 반환
        const width = hotInstance.value?.getColWidth(i) ?? 50; // 기본값 50
        allColWidths.push(width);
      }
      
      tableState.colWidths = allColWidths;
      saveStateDebounced();
    }
  );
  
  hotInstance.value.addHook('afterRowResize', 
    (currentRow: number, newSize: number) => {
      console.log(`Row ${currentRow} resized to ${newSize}`);
      
      // 새로운 방식: 전체 행 높이 배열을 가져와서 저장
      const allRowHeights: number[] = [];
      const numRows = hotInstance.value?.countRows() ?? 0;
      
      for (let i = 0; i < numRows; i++) {
        // getRowHeight는 해당 행의 현재 높이를 반환
        const height = hotInstance.value?.getRowHeight(i) ?? 23; // 기본값 23
        allRowHeights.push(height);
      }
      
      tableState.rowHeights = allRowHeights;
      saveStateDebounced();
    }
  );
  
  hotInstance.value.addHook('afterChange', 
    (changes, source) => {
      if (source === 'loadData') return;
      if (changes) {
        tableState.data = hotInstance.value?.getData() ?? [];
        saveStateDebounced();
      }
    }
  );
}

// 디바운스 및 저장 함수 (변경 없음)
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
const saveStateDebounced = () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(() => {
    saveState();
  }, 500);
}

const saveState = async () => {
  try {
    await axios.post('http://localhost:3000/table-state', {
      data: JSON.stringify(tableState.data),
      colWidths: JSON.stringify(tableState.colWidths),
      rowHeights: JSON.stringify(tableState.rowHeights),
    });
    console.log('Table state saved with widths:', tableState.colWidths);
    console.log('Table state saved with heights:', tableState.rowHeights);
  } catch (error) {
    console.error('Error saving table state:', error);
  }
}

// 초기 상태 로드
const loadState = async () => {
  try {
    const response = await axios.get('http://localhost:3000/table-state');
    if (response.data) {
      const state = response.data;
      const parsedData = JSON.parse(state.data);
      
      // 너비와 높이 파싱
      let parsedColWidths: number[] = [];
      let parsedRowHeights: number[] = [];
      
      try {
        const rawColWidths = JSON.parse(state.colWidths);
        // 필터링: null/undefined 제거하고 유효한 숫자만 사용
        parsedColWidths = Array.isArray(rawColWidths) 
          ? rawColWidths.slice(0, 10).map(w => typeof w === 'number' ? w : 50)
          : Array(10).fill(50);
          
        const rawRowHeights = JSON.parse(state.rowHeights);
        parsedRowHeights = Array.isArray(rawRowHeights)
          ? rawRowHeights.slice(0, 10).map(h => typeof h === 'number' ? h : 23) 
          : Array(10).fill(23);
        
        console.log('Parsed widths:', parsedColWidths);
        console.log('Parsed heights:', parsedRowHeights);
      } catch (e) {
        console.error('Error parsing column/row dimensions:', e);
        parsedColWidths = Array(10).fill(50);
        parsedRowHeights = Array(10).fill(23);
      }

      tableState.data = parsedData;
      tableState.colWidths = parsedColWidths;
      tableState.rowHeights = parsedRowHeights;
    } else {
      tableState.data = Array(10).fill(0).map(() => Array(10).fill(''));
      tableState.colWidths = Array(10).fill(50); // 기본 열 너비
      tableState.rowHeights = Array(10).fill(23); // 기본 행 높이
    }
  } catch (error) {
    console.error('Error loading table state:', error);
    tableState.data = Array(10).fill(0).map(() => Array(10).fill(''));
    tableState.colWidths = Array(10).fill(50);
    tableState.rowHeights = Array(10).fill(23);
  }
}

// 새로운 함수: 핸드온테이블 초기화
const initializeHansonTable = () => {
  if (!hotTableContainer.value) return;
  
  const settings: Handsontable.GridSettings = {
    data: tableState.data,
    colHeaders: true,
    rowHeaders: true,
    height: 500,
    width: 800,
    manualColumnResize: true,
    manualRowResize: true,
    colWidths: tableState.colWidths,
    rowHeights: tableState.rowHeights,
    contextMenu: true,
    licenseKey: 'non-commercial-and-evaluation'
  };
  
  // 기존 인스턴스 제거
  if (hotInstance.value) {
    hotInstance.value.destroy();
  }
  
  // 새 인스턴스 생성
  hotInstance.value = new Handsontable(hotTableContainer.value, settings);
  
  // 이벤트 핸들러 등록
  registerEvents();
}

onMounted(async () => {
  // 데이터 먼저 로드
  await loadState();
  
  // 핸드온테이블 초기화
  initializeHansonTable();
});

onUnmounted(() => {
  // 인스턴스 정리
  if (hotInstance.value) {
    hotInstance.value.destroy();
  }
});
</script>

<style scoped>
.hot-table-container {
  margin: 0 auto;
  padding: 20px;
}

#hot-table {
  width: 100%;
  height: 100%;
}
</style> 