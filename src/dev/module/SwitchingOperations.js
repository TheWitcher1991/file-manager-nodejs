module.exports = function () {
    document.querySelectorAll('.popup__wrap').forEach(function (el) {
        el.addEventListener('click', function (e) {
            if (e.target.closest('.popup__container') === null) {
                this.style.display = 'none'
                this.querySelector('.popup__container').style.display = 'none'
            }
        })
    })

    document.addEventListener('mouseup', function (event) {
        if (!event.srcElement.classList.value.includes('user-select-none')) {
            this.querySelectorAll('.context__file').forEach(el => el.style.cssText = 'display:none')
            this.querySelectorAll('.file__table-ctx').forEach(el => el.classList.remove('context__active'))
        }

        const e = document.querySelectorAll('.tb__popup')
        e.forEach(el => {
            if (!el.contains(event.target)) el.style.display = 'none'
        })
        document.querySelectorAll('.tb__span').forEach(el => el.classList.remove('tb__bth-active'))
    })

    const a = (main, tmp) => {
        document.querySelector(main).addEventListener('click', function () {
            if (tmp === '.kit__popup') {
                document.querySelector('.new__popup').style.display = 'none'
                document.querySelector('.search__popup').style.display = 'none'
                document.querySelector('.remember__popup').style.display = 'none'
            } else if (tmp === '.new__popup') {
                document.querySelector('.kit__popup').style.display = 'none'
                document.querySelector('.search__popup').style.display = 'none'
                document.querySelector('.remember__popup').style.display = 'none'
            } else if (tmp === '.search__popup') {
                document.querySelector('.kit__popup').style.display = 'none'
                document.querySelector('.new__popup').style.display = 'none'
                document.querySelector('.remember__popup').style.display = 'none'
            } else if (tmp === '.remember__popup') {
                document.querySelector('.kit__popup').style.display = 'none'
                document.querySelector('.new__popup').style.display = 'none'
                document.querySelector('.search__popup').style.display = 'none'
            }
            if (main === '.kit__button-span') {
                document.querySelector('.new__button-span').classList.remove('tb__bth-active')
                document.querySelector('.search__button-span').classList.remove('tb__bth-active')
                document.querySelector('.remember__button-span').classList.remove('tb__bth-active')
            } else if (main === '.new__button-span') {
                document.querySelector('.kit__button-span').classList.remove('tb__bth-active')
                document.querySelector('.search__button-span').classList.remove('tb__bth-active')
                document.querySelector('.remember__button-span').classList.remove('tb__bth-active')
            } else if (main === '.search__button-span') {
                document.querySelector('.kit__button-span').classList.remove('tb__bth-active')
                document.querySelector('.new__button-span').classList.remove('tb__bth-active')
                document.querySelector('.remember__button-span').classList.remove('tb__bth-active')
            } else if (main === '.remember__button-span') {
                document.querySelector('.kit__button-span').classList.remove('tb__bth-active')
                document.querySelector('.new__button-span').classList.remove('tb__bth-active')
                document.querySelector('.search__button-span').classList.remove('tb__bth-active')
            }
            this.classList.toggle('tb__bth-active')
            if (document.querySelector(tmp).style.display === 'none') {
                document.querySelector(tmp).style.display = 'block'
            } else {
                document.querySelector(tmp).style.display = 'none'
            }
        })
    }

    a('.kit__button-span', '.kit__popup')
    a('.new__button-span', '.new__popup')
    a('.search__button-span', '.search__popup')
    a('.remember__button-span', '.remember__popup')
}
