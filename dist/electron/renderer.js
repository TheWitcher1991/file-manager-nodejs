window.addEventListener('DOMContentLoaded', () => {
    
    const minimizeButton = document.querySelector('#minimize-button'),
          closeButton    = document.querySelector('#close-button')
    
    minimizeButton.addEventListener('click', e => {
        window.minimizeWindow()
    })

    closeButton.addEventListener('click', e => {
        window.closeWindow()
    })
       
})