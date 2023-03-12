document.addEventListener('click', (e) => {
   let params = {
      active: true,
      currentWindow: true
   }
   chrome.tabs.query(params, (tabs) => {
      const message = {
         url: tabs[0].url,
         reactionId: e.target.value || e.path[1].value
      }
      
      chrome.tabs.sendMessage(tabs[0].id, message)
   })
})