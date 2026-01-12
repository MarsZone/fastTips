<template>
  <div class="app">
    <!-- 左侧书签栏 -->
    <div 
      class="bookmark-sidebar"
      :class="{ 'show': showBookmarks }"
    >
      <h3>书签</h3>
      <div class="bookmark-list">
        <div 
          v-for="(note, index) in notes" 
          :key="note.id" 
          class="bookmark-item"
          @click="scrollToNote(index)"
        >
          <div class="bookmark-color" :style="{ backgroundColor: note.color }"></div>
          <div class="bookmark-title">{{ note.title || '未命名便签' }}</div>
        </div>
      </div>
    </div>
    
    <!-- 书签切换按钮 -->
    <button 
      class="toggle-bookmarks-btn"
      @click="toggleBookmarks"
    >
      {{ showBookmarks ? '◀' : '▶' }}
    </button>
    
    <!-- 主应用内容 -->
    <div class="app-content">
      <header class="header">
        <h1>FastTips</h1>
        <button @click="addNote" class="add-btn">添加便签</button>
      </header>
      <main class="main">
        <div class="notes-grid" ref="notesGrid">
          <div 
            v-for="note in notes" 
            :key="note.id" 
            class="note"
            :style="{ backgroundColor: note.color }"
            :ref="el => noteRefs[note.id] = el"
          >
            <div class="note-header">
              <input 
                v-model="note.title" 
                class="note-title" 
                placeholder="标题"
                @input="saveNotes"
              />
              <button @click="deleteNote(note.id)" class="delete-btn">×</button>
            </div>
            <textarea 
              v-model="note.content" 
              class="note-content" 
              placeholder="写下你的便签内容..."
              @input="saveNotes"
            ></textarea>
            <div class="note-footer">
              <span class="note-date">{{ note.date }}</span>
              <select v-model="note.color" @change="saveNotes" class="color-select">
                <option value="#ffeb3b">黄色</option>
                <option value="#4caf50">绿色</option>
                <option value="#2196f3">蓝色</option>
                <option value="#ff9800">橙色</option>
                <option value="#e91e63">粉色</option>
              </select>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      notes: [],
      showBookmarks: false,
      noteRefs: {}
    }
  },
  mounted() {
    this.loadNotes()
  },
  methods: {
    addNote() {
      const newNote = {
        id: Date.now(),
        title: '',
        content: '',
        color: '#ffeb3b',
        date: new Date().toLocaleString()
      }
      this.notes.push(newNote)
      this.saveNotes()
    },
    deleteNote(id) {
      this.notes = this.notes.filter(note => note.id !== id)
      this.saveNotes()
    },
    saveNotes() {
      localStorage.setItem('fastTipsNotes', JSON.stringify(this.notes))
    },
    loadNotes() {
      const savedNotes = localStorage.getItem('fastTipsNotes')
      if (savedNotes) {
        this.notes = JSON.parse(savedNotes)
      }
    },
    toggleBookmarks() {
      this.showBookmarks = !this.showBookmarks
    },
    scrollToNote(index) {
      const noteElement = Object.values(this.noteRefs)[index]
      if (noteElement) {
        noteElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
        // 高亮显示选中的便签
        noteElement.classList.add('highlight')
        setTimeout(() => {
          noteElement.classList.remove('highlight')
        }, 1000)
      }
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: rgba(0, 0, 0, 0.1); /* 背景半透明 */
}

.app {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

/* 书签侧边栏样式 */
.bookmark-sidebar {
  width: 0;
  background-color: rgba(255, 255, 255, 0.9);
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 100;
}

.bookmark-sidebar.show {
  width: 200px;
}

.bookmark-sidebar h3 {
  padding: 15px;
  font-size: 1.1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.bookmark-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.bookmark-item {
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 5px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.bookmark-item:hover {
  background-color: rgba(240, 240, 240, 0.8);
}

.bookmark-color {
  width: 15px;
  height: 15px;
  border-radius: 3px;
  margin-right: 10px;
}

.bookmark-title {
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 书签切换按钮 */
.toggle-bookmarks-btn {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-left: none;
  padding: 10px 5px;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
  z-index: 101;
  transition: left 0.3s ease;
}

.bookmark-sidebar.show + .toggle-bookmarks-btn {
  left: 200px;
}

/* 主应用内容样式 */
.app-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  transition: margin-left 0.3s ease;
}

/* 头部样式 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  color: #333;
}

.header h1 {
  font-size: 2rem;
}

.add-btn {
  background-color: rgba(76, 175, 80, 0.9);
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-btn:hover {
  background-color: rgba(76, 175, 80, 1);
}

/* 便签网格样式 */
.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

/* 便签样式 */
.note {
  background-color: #ffeb3b;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 15px;
  display: flex;
  flex-direction: column;
  min-height: 200px;
  transition: transform 0.3s, box-shadow 0.3s;
  opacity: 0.95;
}

.note:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.note.highlight {
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.5);
  animation: pulse 1s ease-in-out;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.note-title {
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  background: transparent;
  outline: none;
  width: 80%;
}

.delete-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  transition: color 0.3s;
}

.delete-btn:hover {
  color: #ff0000;
}

.note-content {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  resize: none;
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 10px;
}

.note-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #666;
}

.color-select {
  border: none;
  border-radius: 4px;
  padding: 5px;
  cursor: pointer;
}
</style>