(function () {

    'use strict'

    let isset = vars => vars !== null && vars !== undefined

    let db = {
        pathFrom : isset(localStorage.getItem('pathFrom')) ? String(localStorage.getItem('pathFrom')) : '',
        pathTo   : isset(localStorage.getItem('pathTo')) ? String(localStorage.getItem('pathTo')) : ''
    }

    console.log(db)

    const fetchJSONFile = (path, callback) => {
        let httpRequest = new XMLHttpRequest()
        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    let data = JSON.parse(httpRequest.responseText)
                    if (callback) callback(data)
                }
            }
        }
        httpRequest.open('GET', path)
        httpRequest.send()
    }

    document.addEventListener('DOMContentLoaded', function () {


        if (db.pathFrom.trim() === '') {
            document.querySelector('.popup__wrap').style.display = 'flex'
            document.querySelector('.popup__container').style.display = 'block'

            document.querySelector('.bth__path-save').addEventListener('click', function () {

                let pathFrom = document.querySelector('#path-from'),
                    pathTo   = document.querySelector('#path-to')

                db.pathFrom = pathFrom.value
                db.pathTo   = pathTo.value


                if (localStorage.setItem('pathFrom', db.pathFrom) && localStorage.setItem('pathTo', db.pathTo)) {
                    document.querySelector('.popup__wrap').style.display = 'none'
                    document.querySelector('.popup__container').style.display = 'none'
                }





                /* const json = fs.readFileSync('../../dist/db/db.json', {
                    encoding: 'utf-8'
                })
                const obj = JSON.parse(json)
                obj.pathTo = pathTo.value
                const json2 = JSON.stringify(obj);
                fs.writeFileSync('../../dist/db/db.json', json2); */

            })
        } else {



        }

    }, false)

})(document, window)