const { app, BrowserWindow } = require('electron')

const createWindow = () => {
    const win = new BrowserWindow(
      {
      width: 800,
      height: 800,
      resizable: false
    })
  
    win.loadFile('index.html')
  }

app.whenReady().then(() => {
createWindow()
})

app.on('window-all-closed', ()=>{

    app.quit();
});