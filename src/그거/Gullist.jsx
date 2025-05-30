// import './Gullist.css';
// import Tableview from "../hooks/Tableview.jsx";
//
// function Gullist() {
//     return (
//         <main>
//             <Tableview />
//             <main>
//                 <input type="button" value="전체보기"/>
//                 <select id="type">
//                     <option value="0">제목</option>
//                     <option value='1'>본문</option>
//                     <option value='2'>작성자</option>
//                 </select>
//                 <input type="text" id="value"/>
//                 <input type="button" value="검색" onClick="searchgull()"/>
//                 <a href="/team/gullwrite"><input type="button" value="글쓰기"/></a>
//             </main>
//
//         </main>
//     );
// }
//
// export default Gullist;
import './Gullist.css';
import {useEffect, useState} from "react";
import axios from "axios";
//import DataGrid from "@mui/x-data-grid";

function Gullist() {

    useEffect(() => {
        axios.get('/team/viewlist')
            .then(response => {
                let d=response.data;
                let s="";
                let table=document.getElementById("gullist");
                s+="<tr><th>글번호</th><th width=50%>제목</th><th>작성자</th><th>작성일</th><th>조회수</th></tr>";
                for(let i=0;i<d.length;i++){
                    s+="<tr>";
                    s+="<td>"+d[i].num+"</td>"+"<td>"+d[i].title+"</td>"+"<td>"+d[i].name+"</td>"+
                        "<td>"+d[i].indate+"</td>"+"<td>"+d[i].count+"</td>";
                    s+="</tr>";
                }
                table.innerHTML=s;

            })
            .catch(response => console.log(response))
    }, []);

    return (
        <main>
            {/*<DataGrid columns={} rows={}/>*/}
            <table id="gullist" onLoad="add()">
                <tbody>
                <tr>
                    <th>글번호</th>
                    <th width="50%">제목</th>
                    <th>작성자</th>
                    <th>작성일</th>
                    <th>조회수</th>
                </tr>
                </tbody>
            </table>
            <main>
                <input type="button" value="전체보기"/>
                <select id="type">
                    <option value="0">제목</option>
                    <option value='1'>본문</option>
                    <option value='2'>작성자</option>
                </select>
                <input type="text" id="value"/>
                <input type="button" value="검색" onClick="searchgull()"/>
                <a href="/team/gullwrite"><input type="button" value="글쓰기"/></a>
            </main>

        </main>
    );
}

export default Gullist;
