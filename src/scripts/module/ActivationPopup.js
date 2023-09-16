module.exports = function () {
    document.querySelector('.info-button').addEventListener('click', function () {
        document.querySelector('.info__from-pop').style.display = 'flex'
        document.querySelector('.info__from-container').style.display = 'block'
    })

    document.querySelector('.close__info').addEventListener('click', function () {
        document.querySelector('.info__from-pop').style.display = 'none'
        document.querySelector('.info__from-container').style.display = 'none'
    })

    document.querySelector('.close__need').addEventListener('click', function () {
        document.querySelector('.need__from-pop').style.display = 'none'
        document.querySelector('.need__from-container').style.display = 'none'
    })

    document.querySelector('.tb__apply').addEventListener('click', function () {
        document.querySelector('.preset__from-pop').style.display = 'flex'
        document.querySelector('.preset__from-container').style.display = 'block'
    })

    document.querySelector('.global__button-danger').addEventListener('click', function () {
        document.querySelector('.need__from-pop').style.display = 'flex'
        document.querySelector('.need__from-container').style.display = 'block'
    })

    document.querySelector('.bth__preset-cancel').addEventListener('click', function () {
        document.querySelector('.preset__from-pop').style.display = 'none'
        document.querySelector('.preset__from-container').style.display = 'none'
    })

    document.querySelector('.delete__preset').addEventListener('click', function () {
        document.querySelector('.delpreset__from-pop').style.display = 'flex'
        document.querySelector('.delpreset__from-container').style.display = 'block'
    })

    document.querySelector('.cancel__danger-pop').addEventListener('click', function () {
        document.querySelector('.delpreset__from-pop').style.display = 'none'
        document.querySelector('.delpreset__from-container').style.display = 'none'
    })

    document.querySelector('.cancel__file-pop').addEventListener('click', function () {
        document.querySelector('.delfile__from-pop').style.display = 'none'
        document.querySelector('.delfile__from-container').style.display = 'none'
    })

    document.querySelector('.bth__change-cancel').addEventListener('click', function () {
        document.querySelector('.change__from-pop').style.display = 'none'
        document.querySelector('.change__from-container').style.display = 'none'

        document.querySelector('#preset-id').value = ''
        document.querySelector('#change-name').value = ''
        document.querySelector('#change-from').value = ''
        document.querySelector('#change-to').value = ''
        document.querySelector('#change-file').value = ''
        document.querySelector('#change-name-from').value = ''
        document.querySelector('#change-name-to').value = ''
        document.querySelector('#change-size').value = ''
    })
}