if (document.getElementById('alertSuccess').className === 'alertSuccess') {
    if (localStorage.getItem('textArea')) {
        localStorage.removeItem('textArea')
    }
}