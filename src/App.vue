<template>
  <div class="app">
    <header class="header">
      <h1>FastTips</h1>
      <button @click="addNote" class="add-btn">添加便签</button>
    </header>
    <main class="main">
      <div class="notes-grid">
        <div 
          v-for="note in notes" 
          :key="note.id" 
          class="note"
          :style="{ backgroundColor: note.color }"
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
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      notes: []
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
  background-color: #f5f5f5;
}

.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header h1 {
  color: #333;
  font-size: 2rem;
}

.add-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-btn:hover {
  background-color: #45a049;
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.note {
  background-color: #ffeb3b;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 15px;
  display: flex;
  flex-direction: column;
  min-height: 200px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.note:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
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
