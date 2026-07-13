import React, { useState, useEffect } from 'react'
import Markdown from 'react-markdown'
import { Moon, Sun, Menu, X, BookOpen, Printer, Edit3, Save } from 'lucide-react'
// We append ?raw to get it as a string from Vite
import initialManuscript from '../../The_Improbability_of_Me_Master_Draft.md?raw'

function App() {
  const [chapters, setChapters] = useState([])
  const [activeChapter, setActiveChapter] = useState(0)
  const [theme, setTheme] = useState('dark')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Editing states
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Parse manuscript
  const parseManuscript = (rawText) => {
    const parts = rawText.split(/(?=# Chapter \d+)/)
    return parts.map((part, index) => {
      const match = part.match(/# (.*?)\n/)
      const title = match ? match[1] : (index === 0 ? "Prologue & Intro" : `Chapter ${index}`)
      return { id: index, title, content: part }
    })
  }

  useEffect(() => {
    setChapters(parseManuscript(initialManuscript))
    document.documentElement.setAttribute('data-theme', theme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const handleChapterClick = (index) => {
    setActiveChapter(index)
    setSidebarOpen(false)
    setIsEditing(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePrint = () => {
    window.print()
  }

  const handleEditToggle = () => {
    if (!isEditing) {
      setEditContent(chapters[activeChapter].content)
      setIsEditing(true)
    } else {
      setIsEditing(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Update local state first
    const updatedChapters = [...chapters]
    updatedChapters[activeChapter].content = editContent
    setChapters(updatedChapters)

    // Reconstruct the full manuscript
    const fullManuscript = updatedChapters.map(c => c.content).join('')

    // Send to our custom Vite plugin API to save to disk
    try {
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: fullManuscript })
      })
      if (!response.ok) throw new Error('Network response was not ok')
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to save:", error)
      alert("Failed to save to disk. Check console.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="app-container">
      {/* Mobile Toggle */}
      <button className="mobile-nav-toggle hide-on-print" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <X size={24} /> : <BookOpen size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar glass hide-on-print ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-title">The Improbability of Me</h1>
          <div className="sidebar-subtitle">Michael Thompson</div>
        </div>

        <ul className="chapter-list">
          {chapters.map((chapter, index) => (
            <li 
              key={index} 
              className={`chapter-item ${activeChapter === index ? 'active' : ''}`}
              onClick={() => handleChapterClick(index)}
            >
              {chapter.title}
            </li>
          ))}
        </ul>

        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {chapters.length > 0 && (
          <div className="content-wrapper" key={activeChapter}>
            
            {/* Toolbar */}
            <div className="content-toolbar hide-on-print">
              <div className="toolbar-actions">
                {isEditing ? (
                  <button className="btn btn-save" onClick={handleSave} disabled={isSaving}>
                    <Save size={18} /> {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                ) : (
                  <>
                    <button className="btn btn-edit" onClick={handleEditToggle}>
                      <Edit3 size={18} /> Edit
                    </button>
                    <button className="btn btn-print" onClick={handlePrint}>
                      <Printer size={18} /> Print Chapter
                    </button>
                  </>
                )}
                {isEditing && (
                  <button className="btn btn-cancel" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Editor or Markdown View */}
            {isEditing ? (
              <textarea 
                className="markdown-editor" 
                value={editContent} 
                onChange={(e) => setEditContent(e.target.value)}
              />
            ) : (
              <div className="markdown-body">
                <Markdown>{chapters[activeChapter].content}</Markdown>
              </div>
            )}
            
          </div>
        )}
      </main>
    </div>
  )
}

export default App
