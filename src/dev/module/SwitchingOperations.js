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
        document.querySelector('.' + main).addEventListener('click', function () {
            document.querySelectorAll('.tb__popup').forEach(el => {
                if (!el.classList.value.includes(tmp)) {
                    el.style.display = 'none'
                }
            })

            document.querySelectorAll('.tb__span').forEach(el => {
                if (!el.classList.value.includes(main)) {
                    el.classList.remove('tb__bth-active')
                }
            })

            this.classList.toggle('tb__bth-active')

            if (document.querySelector('.' + tmp).style.display === 'none') {
                document.querySelector('.' + tmp).style.display = 'block'
            } else {
                document.querySelector('.' + tmp).style.display = 'none'
            }
        })
    }

    a('kit__button-span', 'kit__popup')
    a('new__button-span', 'new__popup')
    a('search__button-span', 'search__popup')
    a('remember__button-span', 'remember__popup')
    a('regexp__button-span', 'regexp__popup')
}
