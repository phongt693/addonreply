chrome.runtime.onMessage.addListener( (msg, sender, sendResponse) => {
    
    //get sliced request uri
    const index = msg.url.indexOf('/t')
    const sliced = msg.url.slice(index)
    
    packUpData(sliced, msg.reactionId)
})   
    

function packUpData(uri, id) {
    const csrf_token = document.getElementById("XF").getAttribute("data-csrf")

    //get list of post_id
    let postId_list = []
    const bookmark = document.getElementsByClassName('bookmarkLink')
    
    // Iteration of Array-like HTML DOM Collection
    for (let item of bookmark) {
        const p = item.getAttribute('href').slice(3, -9)
        postId_list.push(p)
    }

    autoReact(csrf_token, postId_list, uri, id)
}

function autoReact(token, id_list, request_uri, reaction_id) {
    const prefix = "_xf"
    const formData = new FormData()
    
    formData.append(`${prefix}Token`, token)
    formData.append(`${prefix}WithData`, reaction_id)
    formData.append(`${prefix}ResponseType`, 'json')
    
    id_list.forEach(post => {
        const mutatedUri = `https://voz.vn/t/${post}/react?reaction_id=${reaction_id}`
        formData.append(`${prefix}RequestUri`, request_uri)

        const xhr = new XMLHttpRequest()

        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                const data = JSON.parse(xhr.responseText)
                
                const icons = document.getElementsByClassName('actionBar-action--reaction')
                for (let icon of icons) {
                    icon.innerHTML = ''
                    if (data.reactionId) {
                        icon.classList.remove('reaction--imageHidden')
                        icon.classList.add('has-reaction')

                        if (data.reactionId == 2) {
                            icon.classList.remove('reaction--1')
                            icon.classList.add('reaction--2')
                        }
                        else {
                            icon.classList.remove('reaction--2')
                            icon.classList.add('reaction--1')
                        }
                    } else {
                        icon.classList.remove('has-reaction')
                        icon.classList.add('reaction--imageHidden')
                        if ( !icon.classList.contains('reaction--1') ) {
                            icon.classList.remove('reaction--2')
                            icon.classList.add('reaction--1')   
                        }
                    }                    
                    icon.insertAdjacentHTML('beforeend', data.html.content)
                }
            }
        }
        xhr.open('POST', mutatedUri, true)
        xhr.send(formData)
    })
}



