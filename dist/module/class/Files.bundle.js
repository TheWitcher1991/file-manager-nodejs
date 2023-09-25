'use strict';const path=require("path"),fs=require("fs"),{resolve}=require("path");function promisify(a){return function(){return new Promise((b,c)=>a(...Array.from(arguments),(a,d)=>a?c(a):b(d)))}}const readdir=promisify(fs.readdir),stat=promisify(fs.stat);class Files{constructor(a,b,c="",d="",e=[],f=[],g=0,h=[],i=1,j=0,k=[],l=0){this.db=a,this.selector=b,this.from=c,this.to=d,this.preset="start",this.activeFilesSort=[],this.remember=e,this.regexp=f,this.count=g,this.files=h,this.readSubfolders=i,this.activeFiles=j,this.activeList=k,this.countRender=l,this.baseDir="",this.bindScroll=1,this.htmlFiles=[],this.mod=0,this.typeFiles=[{img:`<img src="${path.join(__dirname,"../../public/img/png/html.png")}" />`,path:"../../public/img/png/html.png",type:[".html",".htm",".htb",".htx",".htg"]},{img:`<img src="${path.join(__dirname,"../../public/img/png/xml.png")}" />`,path:"../../public/img/png/xml.png",type:[".xml"]},{img:`<img src="${path.join(__dirname,"../../public/img/png/exe.png")}" />`,path:"../../public/img/png/exe.png",type:[".exe"]},{img:`<img src="${path.join(__dirname,"../../public/img/png/js.png")}" />`,path:"../../public/img/png/js.png",type:[".js",".jsx",".cjs"]},{img:`<img src="${path.join(__dirname,"../../public/img/png/java.png")}" />`,path:"../../public/img/png/java.png",type:[".java",".jar"]},{img:`<img src="${path.join(__dirname,"../../public/img/png/python.png")}" />`,path:"../../public/img/png/python.png",type:[".py"]},{img:`<img src="${path.join(__dirname,"../../public/img/png/cpp.png")}" />`,path:"../../public/img/png/cpp.png",type:[".cpp",".bsc",".cur",".dbp"]},{img:`<img src="${path.join(__dirname,"../../public/img/png/c.png")}" />`,path:"../../public/img/png/c.png",type:[".c",".h"]},{img:`<img src="${path.join(__dirname,"../../public/img/png/csharp.png")}" />`,path:"../../public/img/png/csharp.png",type:[".cs"]},{img:`<img src="${path.join(__dirname,"../../public/img/png/swift.png")}" />`,path:"../../public/img/png/swift.png",type:[".swift"]},{img:`<img src="${path.join(__dirname,"../../public/img/png/svg.png")}" />`,path:"../../public/img/png/svg.png",type:[".svg"]},{img:`<img src="${path.join(__dirname,"../../public/img/png/php.png")}" />`,path:"../../public/img/png/php.png",type:[".php"]},{img:`<img src="${path.join(__dirname,"../../public/img/png/ejs.png")}" />`,path:"../../public/img/png/ejs.png",type:[".ejs"]},{img:`<img src="${path.join(__dirname,"../../public/img/png/bash.png")}" />`,path:"../../public/img/png/bash.png",type:[".sh",".cmd"]},{img:`<img src="${path.join(__dirname,"../../public/img/png/json.png")}" />`,path:"../../public/img/png/json.png",type:[".json"]},{img:`<img src="${path.join(__dirname,"../../public/img/png/graphql.png")}" />`,path:"../../public/img/png/graphql.png",type:[".graphql",".agq"]},{img:`<img src="${path.join(__dirname,"../../public/img/png/css.png")}" />`,path:"../../public/img/png/css.png",type:[".css"]},{img:`<img src="${path.join(__dirname,"../../public/img/png/sass.png")}" />`,path:"../../public/img/png/sass.png",type:[".sass",".scss"]},{img:`<img src="${path.join(__dirname,"../../public/img/png/ts.png")}" />`,path:"../../public/img/png/ts.png",type:[".ts",".tsx"]},{img:`<img src="${path.join(__dirname,"../../public/img/png/word.png")}" />`,path:"../../public/img/png/word.png",type:[".docx",".doc",".docm",".dot",".rtf"]},{img:`<img src="${path.join(__dirname,"../../public/img/png/pdf.png")}" />`,path:"../../public/img/png/pdf.png",type:[".pdf"]},{img:`<img src="${path.join(__dirname,"../../public/img/png/powerpoint.png")}" />`,path:"../../public/img/png/powerpoint.png",type:[".pptx",".pptm",".ppt"]},{img:`<img src="${path.join(__dirname,"../../public/img/png/access.png")}" />`,path:"../../public/img/png/access.png",type:[".accdb",".mdb",".dat",".sdf",".mdf"]},{img:`<img src="${path.join(__dirname,"../../public/img/png/database.png")}" />`,path:"../../public/img/png/database.png",type:[".sql",".db",".sqlite",".sqlite3",".crypt"]},{img:`<img src="${path.join(__dirname,"../../public/img/png/excel.png")}" />`,path:"../../public/img/png/excel.png",type:[".xls",".xlsx",".xlsm",".xlsb",".xlsx"]},{img:`<img src="${path.join(__dirname,"../../public/img/png/archive.png")}" />`,path:"../../public/img/png/archive.png",type:[".zip",".7z",".cab",".tar",".deb",".ace",".pak",".rar"]},{img:`<img src="${path.join(__dirname,"../../public/img/png/picture.png")}" />`,path:"../../public/img/png/picture.png",type:[".png",".jpeg",".jpg",".ico",".pict",".gif",".bmp",".jfif",".webm",".tif"]},{img:`<img src="${path.join(__dirname,"../../public/img/png/audio.png")}" />`,path:"../../public/img/png/audio.png",type:[".mp3",".mp4",".m4a",".wav",".wma",".aif",".ac3",".mov",".avi",".amr"]}]}mb_strwidth(a){let b=0,d=a.length,e="",f=0;for(;b<d;b++)e=a.charCodeAt(b),0<=e&&25>=e?f+=0:32<=e&&8191>=e?f+=1:8192<=e&&65376>=e?f+=2:65377<=e&&65439>=e?f+=1:65440<=e&&(f+=2);return f}mb_strimwidth(a,b,d,e){"undefined"==typeof e&&(e="");let f=this.mb_strwidth(e),g=b,c=a.length,h=0,j="";for(;g<c;g++){let b=a.charCodeAt(g),i=a.charAt(g),c=this.mb_strwidth(i),k=a.charAt(g+1),l=this.mb_strwidth(k);if(h+=c,j+=i,h+f+l>d){j+=e;break}}return j}createNotice(a,b=3e3){const c=document.createElement("div");c.className="alert__block",c.id=`alert-${Math.floor(100*Math.random())}`,c.innerHTML=`
            <i class="fa-light fa-bell-on"></i>
            <span>${a}</span>
        `;let d=document.querySelector("#notice__wrapper");d.prepend(c);let e=setTimeout(()=>{c.remove(),clearTimeout(e)},b)}async readFiles(a=""){let b=this.getConfig(),c=b.typeFiles.replace(/\s/g,"").split(/,|-/);try{let d=await readdir(a);const e=await Promise.all(d.map(async d=>{const e=resolve(a,d),f=await stat(e);if(f.isDirectory()&&1===this.readSubfolders)return this.readFiles(e);else{let a=d.replace(/\.[^.]+$/,"");return!((""===b.typeFiles.replace(/\s/g,"")||c.includes(path.extname(e).toLowerCase()))&&(""===b.wordLeft.replace(/\s/g,"")||a.startsWith(b.wordLeft))&&(""===b.wordRight.replace(/\s/g,"")||a.endsWith(b.wordRight))&&(!(0<b.sizeFiles)||!(f.size/1e3>b.sizeFiles)))||""===d.replace(/\.[^.]+$/,"").replace(/\s/g,"")||""===path.extname(e).replace(/\s/g,"")||(this.count+=1,{id:this.count,path:e,name:d,uri:a,size:f.size,type:path.extname(e),dir:path.dirname(e),dirName:path.dirname(e).split("\\").at(-1),changed:f.mtime,create:f.birthtime,open:f.ctime,active:0,stats:f})}}));return 0<this.count&&(document.querySelector(".gload div").innerHTML=`Прочитано файлов ${this.count}`),e.reduce((b,a)=>b.concat(a),[])}catch(a){return"\u041D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430 \u0434\u0438\u0440\u0440\u0435\u043A\u0442\u043E\u0440\u0438\u044F"}}trashFiles(a){let b=[],c=a.length,d=a.length;document.querySelector(".gdelete__from-pop").style.display="flex",document.querySelector(".gdelete__from-container").style.display="block",a.forEach(async a=>{try{await fs.unlinkSync(a.path+"")}catch(c){b.push(a.name)}return c--,b.length===d?(alert("\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430. \u0424\u0430\u0439\u043B\u044B \u043D\u0435 \u0431\u044B\u043B\u0438 \u0443\u0434\u0430\u043B\u0435\u043D\u044B"),document.querySelector(".gdelete__from-pop").style.display="none",document.querySelector(".gdelete__from-container").style.display="none",!1):void(document.querySelector(`.file__div-${a.id}`)?.remove(),document.querySelector(".gdelete div").innerHTML=`Осталось файлов ${c}`,0===c&&(document.querySelector(".gdelete__from-pop").style.display="none",document.querySelector(".gdelete__from-container").style.display="none",this.createNotice("\u0424\u0430\u0439\u043B\u044B \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0441\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u044B")))})}copyFiles(a){let b=[],c=a.length,d=a.length;document.querySelector(".gcopy__from-pop").style.display="flex",document.querySelector(".gcopy__from-container").style.display="block",a.forEach(async a=>{try{await fs.copyFileSync(a.path+"",`${this.to}\\${a.name}`+"")}catch(c){b.push(a.name)}return c--,b.length===d?(alert("\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430. \u0424\u0430\u0439\u043B\u044B \u043D\u0435 \u0431\u044B\u043B\u0438 \u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u044B"),document.querySelector(".gcopy__from-pop").style.display="none",document.querySelector(".gcopy__from-container").style.display="none",!1):void(document.querySelector(".gcopy div").innerHTML=`Осталось файлов ${c}`,0===c&&(document.querySelector(".gcopy__from-pop").style.display="none",document.querySelector(".gcopy__from-container").style.display="none",this.createNotice("\u0424\u0430\u0439\u043B\u044B \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0441\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u044B")))})}renameFiles(a){let b=[],c=a.length,d=a.length;document.querySelector(".gtrasf__from-pop").style.display="flex",document.querySelector(".gtrasf__from-container").style.display="block",a.forEach(async a=>{try{await fs.renameSync(a.path+"",`${this.to}\\${a.name}`+"")}catch(c){b.push(a.name)}return c--,b.length===d?(alert("\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430. \u0424\u0430\u0439\u043B\u044B \u043D\u0435 \u0431\u044B\u043B\u0438 \u043F\u0435\u0440\u0435\u043C\u0435\u0449\u0435\u043D\u044B"),document.querySelector(".gtrasf__from-pop").style.display="none",void(document.querySelector(".gtrasf__from-container").style.display="none")):void(document.querySelector(`.file__div-${a.id}`)?.remove(),document.querySelector(".gtrasf div").innerHTML=`Осталось файлов ${c}`,0===c&&(document.querySelector(".gtrasf__from-pop").style.display="none",document.querySelector(".gtrasf__from-container").style.display="none",this.createNotice("\u0424\u0430\u0439\u043B\u044B \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043F\u0435\u0440\u0435\u043C\u0435\u0449\u0435\u043D\u044B")))})}getConfig(){for(let a in this.db){let b=Object.keys(this.db[a])[0]+"";for(let c in this.db[a])if(b===this.preset)return this.db[a][c]}}sliceIntoChunks(a,b){const c=[];for(let d=0;d<a.length;d+=b){const e=a.slice(d,d+b);c.push(e)}return c}throttle(a,b){let c=null;return function(...d){c||(c=setTimeout(()=>{a(...d),clearTimeout(c),c=null},b))}}async preloadFiles(a){document.querySelector(".file__wrapper")?.remove();let b=document.createElement("div");b.classList.add("file__wrapper");let c=document.createElement("div");c.id="file__tbody",c.classList.add("file__tbody"),b.append(c),document.querySelector(".file__context").appendChild(b);let d=document.querySelector(this.selector),e=[];e=665>=window.innerHeight?this.sliceIntoChunks(a,10):this.sliceIntoChunks(a,15);let f=e.length,g=0,h=0;if(0===f)return!1;if(1===e.length)e.forEach(a=>{a.forEach(a=>{d.append(a)})});else{function a(){if(0===f)return!1;const a=document.querySelector(".file__context").offsetHeight,b=window.innerHeight,c=window.scrollY;c+b>=a-b/4&&(e[g].forEach(a=>{let b=document.querySelector(".check__all");b.checked&&(a.querySelector("input").setAttribute("checked","true"),a.querySelector("input").checked=!0),d.append(a)}),g+=1,f-=1)}e.forEach((a,b)=>0===b&&(a.forEach(a=>{d.append(a)}),h=b,g=b+1,f-=1,!1));let b=0;document.querySelector(".file__context").addEventListener("scroll",this.throttle(()=>{const c=document.querySelector(".file__context").scrollTop;c>b&&a(),b=c},100)),window.addEventListener("resize",this.throttle(a,100))}}renderFiles(a,b=1){this.baseDir=this.from.split("\\").at(-1);try{let c=this.getConfig(),d=c.typeFiles.replace(/\s/g,"").split(/,|-/);a.active=this.remember.includes(a.uri)&&1===b?1:0,1===b&&this.regexp.forEach(b=>{let c=new RegExp(`^${b}\\s+([^\n]+)$`,"gi");if(c.test(a.name))return a.active=1,!1});let e=new Date(a.changed).toLocaleString("ru",{year:"numeric",month:"long",day:"numeric",timezone:"UTC"}),f=0;f=100>=a.size/100?`${this.mb_strimwidth((a.size/100).toFixed(0)+"",0,15,"...")} КБ`:1e3>=a.size/1e3?`${this.mb_strimwidth((a.size/1e3).toFixed(0)+"",0,15,"...")} КБ`:`${this.mb_strimwidth((a.size/1e3/1e3).toFixed(2)+"",0,15,"...")} МБ`;let g=a.type.toLowerCase(),h=`<img src="${path.join(__dirname,"../../public/img/png/file.png")}" />`,i=path.join(__dirname,"../../public/img/png/file.png");this.typeFiles.forEach(a=>{a.type.includes(g)&&(h=a.img,i=path.join(__dirname,a.path))}),this.countRender+=1,document.querySelector(".search__result").innerHTML=`Найдено ${this.countRender} файлов`;let j=`
            <div class="user-select-none context__file context__${a.id}">
                <div class="user-select-none context__list context__list-sub">
                    <div class="user-select-none context__item-none">${this.mb_strimwidth(a.name,0,28,"...")}</div>
                </div>
                <!-- <div class="user-select-none context__list">
                    <div class="context__item"><i class="fa-regular fa-ban"></i> Снять выделение</div>
                    <div class="context__item"><i class="fa-regular fa-hashtag"></i> Переименовать</div>

                </div>-->
                <div class="user-select-none context__list context__list-sub">
                   <div class="context__item context__del"><i class="fa-regular fa-trash"></i> Удалить</div>
                    <div class="context__item create__props"><i class="fa-regular fa-gear"></i> Свойства</div>
                </div>
            </div>
            `,k=document.createElement("div");return k.classList.add("file__div",`file__div-${a.id}`),1===a.active?(k.innerHTML=`

                <div class="file__parent file__parent-${a.id}">
                ${j}
                <label class="file__table-ctx file__ctx-${a.id}" for="file__${a.id}"
                data-id="${a.id}"
                data-name="${a.name}"
                data-path="${a.path}"
                >
                <div class="file__table-temp">
                        <div class="container">
                            <div class="sort__check">
                                <div class="checkbox__wrap">
                                    <input type="checkbox" class="files checkbox__files custom-checkbox" name="file__${a.id}" id="file__${a.id}" value="${a.id}
                                    data-id="${a.id}"
                                    data-path="${a.path}"
                                    data-name="${a.name}"
                                    data-type="${a.type}"
                                    data-size="${a.size}"
                                    data-dir="${a.dir}"
                                    data-create="${a.create}"
                                    data-open="${a.open}"
                                    data-psize="${f}"
                                    data-time="${a.changed}"
                                    data-ptime="${e}
                                    data-asize="${f}"
                                    data-img="${i}"
                                    ${1===a.active?"checked":""}
                                    />
                                    <label class="checkbox__label" for="file__${a.id}"></label>
                                </div>
                            </div>
                            <span class="sort__name">
                                ${h}
                                ${this.mb_strimwidth(a.dirName===this.baseDir?a.name:a.dirName+"/"+a.name,0,50,"...")}
                            </span>
                            <span class="sort__size">${f}</span>
                            <span class="sort__type">${this.mb_strimwidth(a.type,0,10,"...")}</span>
                            <span class="sort__time">${e}</span>
                            <span class="sort__more"></span>
                        </div>
                    </div>
                </label>
                </div>

                `,this.activeFiles=1,this.activeList.push({id:a.id,name:a.name,path:a.path}),{html:k,active:1}):(k.innerHTML=`

                <div class="file__parent file__parent-${a.id}">
                ${j}
                <label class="file__table-ctx file__ctx-${a.id}" for="file__${a.id}"
                data-id="${a.id}"
                data-name="${a.name}"
                data-path="${a.path}"
                >

                    <div class="file__table-temp">
                        <div class="container">

                             <div class="sort__check">
                                <div class="checkbox__wrap">
                                    <input type="checkbox" class="files checkbox__files custom-checkbox" name="file__${a.id}" id="file__${a.id}" value="${a.id}
                                    data-id="${a.id}"
                                    data-path="${a.path}"
                                    data-name="${a.name}"
                                    data-type="${a.type}"
                                    data-size="${a.size}"
                                    data-dir="${a.dir}"
                                    data-create="${a.create}"
                                    data-open="${a.open}"
                                    data-psize="${f}"
                                    data-time="${a.changed}"
                                    data-ptime="${e}
                                    data-asize="${f}"
                                    data-img="${i}"
                                    />
                                    <label class="checkbox__label" for="file__${a.id}"></label>
                                </div>
                            </div>

                            <span class="sort__name">
                                ${h}
                                ${this.mb_strimwidth(a.dirName===this.baseDir?a.name:a.dirName+"/"+a.name,0,50,"...")}
                            </span>
                            <span class="sort__size">${f}</span>
                            <span class="sort__type">${this.mb_strimwidth(a.type,0,10,"...")}</span>
                            <span class="sort__time">${e}</span>
                            <span class="sort__more"></span>
                        </div>
                    </div>
                </label>
                </div>


            `,{html:k,active:0})}catch(a){}}async searchFiles(a,b,c){this.countRender=0,this.activeFiles=0,this.activeList=[];let d=this.files,e=this.files.length,f=0;if(d=0<this.activeFilesSort.length?this.activeFilesSort:this.files,1<=b&&4>=b&&1<=c&&2>=c){let a=document.querySelector(".sort__name"),e=document.querySelector(".sort__size"),f=document.querySelector(".sort__type"),g=document.querySelector(".sort__time");document.querySelectorAll(".sort__item").forEach(a=>{a.classList.remove("sort__active"),a.parentNode.querySelector(".sort__arrow")&&a.parentNode.querySelector(".sort__arrow").remove()}),1===b&&1===c?(d.sort((a,b)=>a.name>b.name?1:-1),a.classList.add("sort__active"),a.innerHTML+="<i class=\"fa-solid fa-caret-down sort__arrow\"></i>"):1===b&&2===c?(d.sort((a,b)=>a.name<b.name?1:-1),a.classList.add("sort__active"),a.innerHTML+="<i class=\"fa-solid fa-caret-up sort__arrow\"></i>"):2===b&&1===c?(d.sort((a,b)=>a.size>b.size?1:-1),e.classList.add("sort__active"),e.innerHTML+="<i class=\"fa-solid fa-caret-down sort__arrow\"></i>"):2===b&&2===c?(d.sort((a,b)=>a.size<b.size?1:-1),e.classList.add("sort__active"),e.innerHTML+="<i class=\"fa-solid fa-caret-up sort__arrow\"></i>"):3===b&&1===c?(d.sort((a,b)=>a.type>b.type?1:-1),f.classList.add("sort__active"),f.innerHTML+="<i class=\"fa-solid fa-caret-down sort__arrow\"></i>"):3===b&&2===c?(d.sort((a,b)=>a.type<b.type?1:-1),f.classList.add("sort__active"),f.innerHTML+="<i class=\"fa-solid fa-caret-up sort__arrow\"></i>"):4===b&&1===c?(d.sort((a,b)=>a.changed>b.changed?1:-1),g.classList.add("sort__active"),g.innerHTML+="<i class=\"fa-solid fa-caret-down sort__arrow\"></i>"):4==b&&2==c&&(d.sort((a,b)=>a.changed<b.changed?1:-1),g.classList.add("sort__active"),g.innerHTML+="<i class=\"fa-solid fa-caret-up sort__arrow\"></i>")}this.activeFilesSort=[],""===a.replace(/\s/g,"")?(await this.preloadFiles(this.htmlFiles),document.querySelector(".search__result").innerHTML=`Найдено ${this.files.length} файлов`,this.mod=0):(await Promise.all(d.filter(b=>-1!==b.name.toLowerCase().search(a.toLowerCase())).map(async a=>(this.activeFilesSort.push(a),f++,this.renderFiles(a,0)))).then(async a=>this.preloadFiles(a.reduce((b,a)=>b.concat(a),[]).map(a=>a.html))),this.mod=1,document.querySelector(".search__result").innerHTML=`Найдено ${this.activeFilesSort.length} файлов по запросу ${a}`)}async sortFiles(a,b){this.countRender=0,this.activeFiles=0,this.activeList.length=0;let c=this.files,d=this.files.length;if(0<this.activeFilesSort.length&&(c=this.activeFilesSort),1<=a&&4>=a&&1<=b&&2>=b){let d=document.querySelector(".sort__name"),e=document.querySelector(".sort__size"),f=document.querySelector(".sort__type"),g=document.querySelector(".sort__time");document.querySelectorAll(".sort__item").forEach(a=>{a.classList.remove("sort__active"),a.parentNode.querySelector(".sort__arrow")&&a.parentNode.querySelector(".sort__arrow").remove()}),1===a&&1===b?(c.sort((a,b)=>a.name>b.name?1:-1),d.classList.add("sort__active"),d.innerHTML+="<i class=\"fa-solid fa-caret-down sort__arrow\"></i>"):1===a&&2===b?(c.sort((a,b)=>a.name<b.name?1:-1),d.classList.add("sort__active"),d.innerHTML+="<i class=\"fa-solid fa-caret-up sort__arrow\"></i>"):2===a&&1===b?(c.sort((a,b)=>a.size>b.size?1:-1),e.classList.add("sort__active"),e.innerHTML+="<i class=\"fa-solid fa-caret-down sort__arrow\"></i>"):2===a&&2===b?(c.sort((a,b)=>a.size<b.size?1:-1),e.classList.add("sort__active"),e.innerHTML+="<i class=\"fa-solid fa-caret-up sort__arrow\"></i>"):3===a&&1===b?(c.sort((a,b)=>a.type>b.type?1:-1),f.classList.add("sort__active"),f.innerHTML+="<i class=\"fa-solid fa-caret-down sort__arrow\"></i>"):3===a&&2===b?(c.sort((a,b)=>a.type<b.type?1:-1),f.classList.add("sort__active"),f.innerHTML+="<i class=\"fa-solid fa-caret-up sort__arrow\"></i>"):4===a&&1===b?(c.sort((a,b)=>a.changed>b.changed?1:-1),g.classList.add("sort__active"),g.innerHTML+="<i class=\"fa-solid fa-caret-down sort__arrow\"></i>"):4==a&&2==b&&(c.sort((a,b)=>a.changed<b.changed?1:-1),g.classList.add("sort__active"),g.innerHTML+="<i class=\"fa-solid fa-caret-up sort__arrow\"></i>")}await Promise.all(c.map(async a=>await this.renderFiles(a,0))).then(a=>this.preloadFiles(a.reduce((b,a)=>b.concat(a),[]).map(a=>a.html)))}async updatePath(){this.countRender=0,document.querySelector(".gload__from-pop").style.display="flex",document.querySelector(".gload__from-container").style.display="block",this.activeFiles=0,this.activeList.length=0,this.activeFilesSort.length=0,this.count=0,this.bindScroll=1,this.mod=0,console.time("ReadFiles"),await this.readFiles(this.from).then(async a=>{if(console.timeEnd("ReadFiles"),document.querySelector(".gload__from-pop").style.display="none",document.querySelector(".gload__from-container").style.display="none","object"!=typeof a){let a="";for(let b in this.db){let c=Object.keys(this.db[b])[0]+"";for(let d in this.db[b])if(c===this.getPreset()){a=this.db[b][d].name;break}}return document.querySelector("#preset__letter-name").value=a,document.querySelector(".preset__letter-pop").style.display="flex",document.querySelector(".preset__letter-container").style.display="block",!1}let b=a.filter(a=>"object"==typeof a),c=b.length;this.files=b,document.querySelectorAll(".sort__item").forEach(a=>{a.classList.remove("sort__active"),a.parentNode.querySelector(".sort__arrow")&&a.parentNode.querySelector(".sort__arrow").remove()}),document.querySelector(".global__button-danger").style.display="none",document.querySelector(".need__block > div").innerHTML="",document.querySelector(".sort__name").classList.add("sort__active"),document.querySelector(".sort__name").innerHTML+="<i class=\"fa-solid fa-caret-down sort__arrow\"></i>";let d=[],e=c;document.querySelector(".load__from-pop").style.display="flex",document.querySelector(".load__from-container").style.display="block",console.time("RenderFiles"),await Promise.all(b.map(async a=>(e--,document.querySelector(".load__block div").innerHTML=`Осталось файлов ${e}`,d.push(a.uri),0===e&&(document.querySelector(".load__from-pop").style.display="none",document.querySelector(".load__from-container").style.display="none"),this.renderFiles(a)))).then(a=>{this.htmlFiles=a.reduce((b,a)=>b.concat(a),[]).sort(a=>1===a.active?-1:1).map(a=>a.html),this.preloadFiles(a.reduce((b,a)=>b.concat(a),[]).sort(a=>1===a.active?-1:1).map(a=>a.html))}),console.timeEnd("RenderFiles");let f=[];this.remember.forEach(a=>{d.includes(a)||f.push(a)}),0<f.length&&(document.querySelector(".global__button-danger").style.display="block",f.forEach(a=>document.querySelector(".need__block > div").innerHTML+=`${a}; `)),1===this.activeFiles&&(document.querySelector(".search__result").innerHTML=`Выбрано ${this.activeList.length} файлов`,document.querySelector(".global__button-tran").style.display="flex")})}updateRemember(){document.querySelector(".remember__list").innerHTML="";let a=0;for(let b in this.db){let c=Object.keys(this.db[b])+"";if(c===this.preset)for(let d in this.db[b])this.remember=this.db[b][d].remember,this.db[b][d].remember.forEach(b=>{a++,document.querySelector(".remember__list").innerHTML+=`
                        <div class="remember__item remember__item-${a}">
                            <span>${b}</span>
                            <button
                                class="remember__item-bth remember__item-bth-${a}"
                                data-preset="${c}"
                                data-id="${a}"
                                data-name="${b}"
                            ><i class="fa-regular fa-trash"></i></button>
                        </div>
                    `})}}updateRegexp(){document.querySelector(".regexp__list").innerHTML="";let a=0;for(let b in this.db){let c=Object.keys(this.db[b])+"";if(c===this.preset)for(let d in this.db[b])this.regexp=this.db[b][d].regexp,this.db[b][d].regexp.forEach(b=>{a++,document.querySelector(".regexp__list").innerHTML+=`
                        <div class="regexp__item regexp__item-${a}">
                            <span>${b}</span>
                            <button
                                class="regexp__item-bth regexp__item-bth-${a}"
                                data-preset="${c}"
                                data-id="${a}"
                                data-name="${b}"
                            ><i class="fa-regular fa-trash"></i></button>
                        </div>
                    `})}}updatePreset(){for(let a in document.querySelector(".preset__list").innerHTML="",this.db){let b=Object.keys(this.db[a])[0]+"";for(let c in this.db[a])document.querySelector(".preset__list").innerHTML+=`
                    <div class="preset__item-wrap">
                        <div class="radio__wrap preset__item">
                            <input type="radio" class="preset custom-radio" name="preset" id="${b}" value="${this.db[a][c].name}" ${b===this.preset?"checked":""}
                                    data-from="${this.db[a][c].pathFrom}"
                                    data-to="${this.db[a][c].pathTo}"
                                    data-id="${b}"
                                    data-remember="${this.db[a][c].remember}"
                                    data-regexp="${this.db[a][c].regexp}"
                                    data-db=\'${JSON.stringify(this.db[a][c])}\'
                                    />
                            <label class="radio__label" for="${b}">${this.db[a][c].name}</label>
                        </div>

                        <div>
                            ${"start"===b?"":`<i class="trash__preset fa-regular fa-trash trash__preset-${b}"
                                data-id="${b}"
                            ></i>`}
                            <i class="fa-regular fa-wrench setting__preset-${b}"></i>

                        </div>
                    </div>
                `}}updateDB(a){this.db=a}getActiveList(){return{active:this.activeFiles,list:this.activeList}}getPreset(){return this.preset}getCountFiles(){return 0===this.mod?this.files.length:this.activeFilesSort.length}getFiles(){return 0===this.mod?this.files:this.activeFilesSort}updateFiles(a){this.files=a}startPreset(a="start"){this.preset=a}setPreset(a="",b="",c="",d=[],e=[]){""===a.trim()?this.preset="start":(this.preset=a,this.from=b,this.to=c,this.remember=d,this.regexp=e,this.loadFiles())}setRemember(a){this.remember.push(a+"")}setMod(a=0){this.mod=a}setPathTo(a){this.to=a}setPathFrom(a){this.from=a}cleanActiveList(){this.activeFiles=0,this.activeList=[]}setReadSubfolders(a){this.readSubfolders=a}cleanBase(){document.querySelector(this.selector).innerHTML="",document.querySelector(".remember__list").innerHTML="",document.querySelector(".preset__list").innerHTML="",document.querySelector(".check__all").removeAttribute("checked"),document.querySelector(".check__all").checked=!1,document.querySelector(".home__path").innerHTML="",document.querySelector(".home__to").innerHTML="",document.querySelector(".global__from").value="",document.querySelector(".global__to").value="",document.querySelector(".global__preset").value="",document.querySelector(".global__remember").value="",document.querySelector(".file__tbody").innerHTML=`
            <div class="loader">
                <div class="sk-circle-bounce">
                    <div class="loading-chat">
                        <svg class="spinner" viewBox="0 0 50 50">
                            <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
                        </svg>
                    </div>
                </div>
            </div>`,this.db=[],this.selector="",this.from="",this.to="",this.preset="start",this.activeFilesSort.length=0,this.activeList.length=0,this.activeFiles=0,this.remember.length=0,this.count=0,this.files.length=0}setTheme(a="dark"){document.documentElement.setAttribute("theme",a),"light"===a?document.querySelector(".setting-button").innerHTML="<i class=\"fa-regular fa-brightness\"></i>":"dark"===a&&(document.querySelector(".setting-button").innerHTML="<i class=\"fa-light fa-moon-cloud\"></i>")}setLang(a="ru"){document.documentElement.setAttribute("lang",a),"ru"===a?document.querySelector(".lang-button").innerHTML="<span>RU</span>":"en"===a&&(document.querySelector(".lang-button").innerHTML="<span>EN</span>")}async loadFiles(){this.count=0;let a="",b="",c="";for(let d in this.db)for(let e in this.db[d])c=Object.keys(this.db[d])[0]+"",c===this.preset&&(a=this.db[d][e].pathFrom,b=this.db[d][e].pathTo);this.from=a+"",this.to=b+"",document.querySelector(".home__path").innerHTML=this.from,document.querySelector(".home__to").innerHTML=this.to,document.querySelector(".global__from").value=this.from,document.querySelector(".global__to").value=this.to,document.querySelector(".global__preset").value=this.preset,document.querySelector(".global__remember").value=this.remember,this.updateRemember(),this.updateRegexp(),this.updatePreset(),await this.updatePath()}}module.exports=Files;
