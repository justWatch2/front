
function loadsearch() {
    //window.localStorage.setItem()
    let words=[];
    words = window.localStorage.getItem("word");
    if (words == null) {
        words=[];
    }else{
        words=JSON.parse(words);
    }


    let table = document.getElementById("table2");
    table.style.display = "block";
    table.style.height = "100px";
    table.innerHTML="검색어: \n";
    table.innerHTML += words;
}