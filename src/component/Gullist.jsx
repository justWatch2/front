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
import '../css/Gullist.css';
import {useEffect, useState} from "react";
import axios from "axios";
import {DataGrid, GridColumnMenu} from "@mui/x-data-grid";

import {Link} from "react-router-dom";
import {useNavigate, useParams} from "react-router";




function Gullist() {
    const navigate = useNavigate();
    const [page,setPage] = useState(1);
    const [pageVO, setPageVO] = useState(null);
    const [category,setCategory] = useState("자유");
    const [data, setData] = useState([]);
    const headers=[
        {field:'id',headerName: '글번호',type:"number"},
        {field:'title',headerName: '제목',width:512},
        {field:'member_id',headerName: '작성자'},
        {field:'indate',headerName: '작성일',width: 256},
        {field:'count',headerName: '조회수'},
    ];


    useEffect(() => {
        axios.get('/team/viewlist?page='+page+'&category='+category)
            .then(response => {
                setData([]);
                const newData= ([...response.data.post].map((item) => ({
                        id:item.no,
                        title:item.title,
                        member_id:item.name,
                        indate:item.indate,
                        count:item.count,
                })));
                setData(newData);
                setPageVO(response.data.page);

            })
            .catch(response => console.log(response))

    }, [category,page]);

    useEffect(() => {

    }, [pageVO]);

    const Pagediv=()=>{
        return (<div className="d-flex justify-content-center">
            {pageVO?.prev ?<button >prev</button>
            :<button disabled>prev</button>}
            <Paging />
            {pageVO?.next ?<button >next</button>
                :<button disabled>next</button>}
        </div>)
    }

    const Paging=()=>{
        const result=[];
        for(let i=pageVO?.startPage;i<pageVO?.endPage+1;i++){
            result.push(<button key={i}
                              onClick={(e)=>setPage(e.target.innerHTML)}>{i}</button>)
        }
        return result;
    }


    const categoryHandler=(e)=>{
        setCategory(e.target.value);
        setPage(1);
    }

    const RowClick =(e)=>{
        //alert(e.id);
        navigate('/gullview/'+e.id);
    }

    const orderHandler=(e)=>{

    }
    return (
        <main>
            <div className="d-flex justify-content-between align-items-center p-1">
            <div>
                <button value={"자유"} onClick={categoryHandler}>자유</button>
                <button value={"영화"} onClick={categoryHandler}>영화</button>
                <button value={"건의"} onClick={categoryHandler}>건의</button>
            </div>
                <button value={"건의"} onClick={orderHandler}>인기글</button>
            </div>

            <DataGrid columns={headers} rows={data}
                      disableColumnMenu={true}
                      disableColumnSorting={true}
                      disableColumnResize={true}
                      hideFooter={true}
                      onRowClick={RowClick}
            />

            <Pagediv />
                <br />
            <main className="d-flex justify-content-center">
                <select id="type">
                    <option value="0">제목</option>
                    <option value='1'>본문</option>
                    <option value='2'>작성자</option>
                </select>
                <input type="text" id="value"/>
                <input type="button" value="검색"/>
                <Link to="/gullwrite"><input type="button" value="글쓰기"/></Link>
            </main>

        </main>
    );
}

export default Gullist;
