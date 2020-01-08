import React from 'react'
import './app.css'
import FileViewer from './file-viewer'
function App() {
  return (
    <React.Fragment>
      <header className="app-header">
          File Viewer
      </header>
      <div className="file-viewer">
        <FileViewer />
      </div>
    </React.Fragment>
  )
}

export default App
