window.onbeforeunload = function () {
    if (document.querySelector('#textarea').value.length === null) return
    localStorage.setItem('textArea', document.querySelector('#textarea').value)
}

window.onload = function () {
    let textAreaItem = localStorage.getItem('textArea')
    setTimeout(() => {
        if (textAreaItem !== null)
            document.getElementById('textarea').innerHTML = localStorage.getItem('textArea')
    }, 500)
}

async function submit() {
    document.getElementById('textAreaForm').submit()
}
