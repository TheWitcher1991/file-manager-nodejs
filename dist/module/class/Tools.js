'use strict'

class Tools {

    static rkey (i) {
        let rnd = ''
        while (rnd.length < i)
            rnd += Math.random().toString(36).substring(2)
        return rnd.substring(0, i)
    }

    static mb_strwidth (str) {
        let i = 0,
            l = str.length,
            c = '',
            length = 0;
        for(; i < l; i++){
            c = str.charCodeAt(i);
            if (0x0000 <= c && c <= 0x0019) {
                length += 0;
            } else if (0x0020 <= c && c <= 0x1FFF){
                length += 1;
            } else if (0x2000 <= c && c <= 0xFF60){
                length += 2;
            } else if (0xFF61 <= c && c <= 0xFF9F){
                length += 1;
            } else if (0xFFA0 <= c){
                length += 2;
            }
        }
        return length;
    };

    static mb_strimwidth (str, start, width, trimmarker) {
        if (typeof trimmarker === 'undefined') trimmarker = '';
        let trimmakerWidth = this.mb_strwidth(trimmarker),
            i = start,
            l = str.length,
            trimmedLength = 0,
            trimmedStr = ''

        for( ; i < l; i++){
            let charCode = str.charCodeAt(i),
                c = str.charAt(i),
                charWidth = this.mb_strwidth(c),
                next = str.charAt(i + 1),
                nextWidth = this.mb_strwidth(next)
            trimmedLength += charWidth
            trimmedStr += c
            if (trimmedLength + trimmakerWidth+nextWidth > width) {
                trimmedStr += trimmarker
                break
            }
        }
        return trimmedStr
    }

    static createNotice(text, id = 0) {
        const notice = document.createElement('div')
        notice.className = 'alert__block'
        notice.id = `alert-${id}`
        notice.innerHTML = `
            <i class="fa-light fa-bell-on"></i>
            <span>${text}</span>
        `

        let wrap = document.querySelector('#notice__wrapper')

        wrap.prepend(notice)

        setTimeout(() => {
            notice.remove()
        }, 3000)
    }

    static async promisify(callback) {
        await new Promise((resolve, reject) => {
            resolve(callback())
        })
    }

    static async bind(callback) {
        return await Promise.all(callback())
    }

}

module.exports = Tools