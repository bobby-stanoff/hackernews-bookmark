const BOOKMARK_STORAGE_KEY = "hackernews_bookmark"

let bookmarks = JSON.parse(localStorage.getItem(BOOKMARK_STORAGE_KEY) || '{}');

function StoreBookmark(postId, url, title, user){
    bookmarks[postId] = {url,title,user};
    localStorage.setItem(BOOKMARK_STORAGE_KEY,JSON.stringify(bookmarks));
    console.log(JSON.stringify(bookmarks));
}
function RemoveBookmark(postId){
    delete bookmarks[postId];
    localStorage.setItem(BOOKMARK_STORAGE_KEY,JSON.stringify(bookmarks));
}
function UpdateBookmarkState(){
    bookmarks = JSON.parse(localStorage.getItem(BOOKMARK_STORAGE_KEY) || '{}');
}
function GenerateBookmarkButton() {
    let sublines = document.querySelectorAll(".subline");
    sublines.forEach((line) => {
        let bookmarkButton = line.querySelector(".bookmarkbutton");
        let PostelementId = line.closest('tr').previousElementSibling.id;
        if(bookmarkButton !== null){
            bookmarkButton.textContent = bookmarks.hasOwnProperty(PostelementId) ? "unbookmark" : "bookmark";
        }
        else{
            let bookmarkEl = document.createElement('a');
            bookmarkEl.className = "bookmarkbutton";
            bookmarkEl.textContent = bookmarks.hasOwnProperty(PostelementId) ? "unbookmark" : "bookmark";
            bookmarkEl.href = "javascript:;";
            line.append("| ");
            line.append(bookmarkEl);
            bookmarkEl.addEventListener("click",(ev) => HandleBookmarkClick(ev));
        }
    })
}
function GenereateBookmarkTab(){
    let pagetop = document.querySelector(".pagetop");
    let bookmarkTabEl = document.createElement('a');
    bookmarkTabEl.textContent = 'bookmark';
    bookmarkTabEl.href = "javascript:;";
    pagetop.append("| ");
    pagetop.append(bookmarkTabEl);
    GenerateMenuMarkup();
    bookmarkTabEl.addEventListener("click",(ev) => HandleBookmarkTab(ev));
}
function GenerateMenuMarkup(){
    let bookmarkMenu = document.createElement('div');
    bookmarkMenu.id = "bookmark-menu";
    let menutitle = document.createElement('div');
    menutitle.className = "bookmark-menu-title";
    menutitle.innerText = "bookmarked pages";
    let closeMenu = document.createElement("a")
    closeMenu.innerText = "close";
    closeMenu.href = "javascript:;"
    closeMenu.className = "closebutton";
    menutitle.append(closeMenu);
    bookmarkMenu.append(menutitle);
    let menutable = document.createElement("table");
    menutable.id = "bookmark-table";
    menutable.append(document.createElement("tbody"));
    bookmarkMenu.append(menutable);
    let overlay = document.createElement('div');
    overlay.id = "overlay";
    overlay.className = "hidden";
    overlay.append(bookmarkMenu);
    overlay.addEventListener("click", (e) =>{
        if(e.target === overlay){
            overlay.classList.add("hidden");
            
        }
    } )
    closeMenu.addEventListener("click", e => {
        overlay.classList.add("hidden");
    })
    document.body.append(overlay);
}
function GenerateMenuItem(id,bookmarkItem){
    let url = bookmarkItem.url;
    let urlHost = new URL(url).hostname;
    let title = bookmarkItem.title;
    let user = bookmarkItem.user;
    let Markup = `
    <tr class="athing" id="${id}">
      <td class="title"><span class="titleline"><a href="${url}">${title}</a><span class="sitebit comhead"> (<a href="from?site=${urlHost}"><span
                class="sitestr">${urlHost}</span></a>)</span></span></td>
    </tr>
    <tr>
      <td class="subtext"><span class="subline"> by <a href="user?id=${user}" class="hnuser">${user}</a> | <a
            href="item?id=${id}">discussion</a> | <a class="removebookmark" href="javascript:;">remove</a></span> </td>
    </tr>
    <tr class="spacer" style="height:5px"></tr>
    `;
    return Markup;
}
function HandleBookmarkTab(event){
    UpdateBookmarkState();
    if(document.querySelector("#overlay") !== null){
        document.querySelector("#overlay").classList.remove("hidden");
    }
    let bookmarkTable = document.querySelector("#bookmark-table >tbody");
    if( bookmarkTable !== null){
        bookmarkTable.innerHTML = "";
        for(let key in bookmarks){
            let bookmarkItem = GenerateMenuItem(key,bookmarks[key]);
            bookmarkTable.innerHTML += bookmarkItem;
        }
        bookmarkTable.querySelectorAll(".removebookmark").forEach(removeButton => {
            removeButton.addEventListener("click",e => HandleBookmarkRemoveClick(e));
        })
    }
}
function HandleBookmarkClick(event){
    let athingRow = event.target.closest("tr").previousElementSibling;
    if(athingRow){
        let postid = athingRow.id;
        let url = athingRow.querySelector(".titleline >a").href;
        let title = athingRow.querySelector(".titleline >a").textContent;
        let user = event.target.parentElement.querySelector(".hnuser").textContent;
        if(bookmarks.hasOwnProperty(postid)){
            RemoveBookmark(postid);
            event.target.textContent = "bookmark";
        } else{
            StoreBookmark(postid,url,title,user);
            event.target.textContent = "unbookmark";
        }
    }
    UpdateBookmarkState();
    
}
function HandleBookmarkRemoveClick(e){
    let postId = e.target.closest("tr").previousElementSibling.id;
    RemoveBookmark(postId);
    UpdateBookmarkState();
    GenerateBookmarkButton()
    HandleBookmarkTab();
}
function init(){
    GenerateBookmarkButton();
    GenereateBookmarkTab();
}
init();
