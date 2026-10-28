import React, { useState, useEffect } from 'react'
import Markdown from 'react-markdown'
import { Moon, Sun, X, BookOpen, Printer } from 'lucide-react'
// We append ?raw to get it as a string from Vite
import initialManuscript from '../../Am_I_The_Bad_Guy_Master_Draft.md?raw'

function App() {
  const [chapters, setChapters] = useState([])
  const [activeChapter, setActiveChapter] = useState(0)
  const [theme, setTheme] = useState('dark')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Split on every top-level heading so chapter order matches the master draft,
  // including the title page, Epilogue, and About the Author.
  const parseManuscript = (rawText) => {
    const parts = rawText.split(/(?=^# )/m).filter((part) => part.trim() !== '')
    return parts.map((part, index) => {
      const match = part.match(/^# ([^\r\n]+)/)
      const title = match ? match[1].trim() : `Section ${index + 1}`
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
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePrint = () => {
    window.print()
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
          <h1 className="sidebar-title">Am I the Bad Guy?</h1>
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
                <button className="btn btn-print" onClick={handlePrint}>
                  <Printer size={18} /> Print Chapter
                </button>
              </div>
            </div>

            {/* Chapter text */}
            <div className="markdown-body">
              <Markdown>{chapters[activeChapter].content}</Markdown>
            </div>
            
          </div>
        )}
      </main>
    </div>
  )
}

export default App
