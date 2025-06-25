import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import poster from "../assets/blank-poster-template-.jpg"

function Result({list,setFilter}){
    const [isNull,setIsNull] = useState(true);
    const [pageVO,setPageVO] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if(list==null || list?.data?.movie?.length===0){
            setIsNull(true);
        }else{
            setIsNull(false);
            setPageVO(list?.data?.page);
        }
        //alert(JSON.stringify(list));
    }, [list]);


    function handleClickMovie(id,numVotes,averagerating){
        const link=list.category ? '/tv/':'/movie/';
        navigate("/detail"+link+id,{
            state:{
                numVotes:numVotes,
                averagerating:averagerating
            }
        });
    }

    const movieList = list?.data?.movie?.map((res, index) => (
        <div key={index} className="card bg-dark text-light mb-4 border-light shadow" onClick={() => handleClickMovie(res.id,res.numVotes,res.averagerating)} style={{ cursor: 'pointer' }}>
            <div className="row g-0">
                <div className="col-md-3">
                    <img
                        src={res?.poster_path===""  ? poster:`https://image.tmdb.org/t/p/w200${res.poster_path}`}
                        alt={res.title} width={200} height={300}
                        className="img-fluid rounded-start h-100 object-fit-cover"
                    />
                </div>
                <div className="col-md-9">
                    <div className="card-body">
                        <h5 className="card-title text-info">🎬 {res.korean_title}</h5>
                        <p className="card-text text-light">
                            <strong>줄거리:</strong> {res.overview || "내용 없음"}
                        </p>
                        <p className="card-text text-light">
                            <strong>평점:</strong> {res.averagerating}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    ));

    const Pagediv=()=>{
        return (<div className="d-flex justify-content-center">
            {pageVO?.prev ?<button onClick={() => {
                    setFilter(prev => ({ ...prev, page: pageVO.startPage - 1 }));;
                    window.scrollTo(0, 0);
                }}>prev</button>
                :<button disabled>prev</button>}
            <Paging />
            {pageVO?.next ?<button onClick={() => {
                    setFilter(prev => ({ ...prev, page: pageVO.endPage + 1 }));;
                    window.scrollTo(0, 0);
                }}>next</button>
                :<button disabled>next</button>}
        </div>)
    }

    const Paging=()=>{
        const result=[];
        for(let i=pageVO?.startPage;i<pageVO?.endPage+1;i++){
            result.push(<button key={i}
            onClick={()=>
            {setFilter(prev => ({...prev, page: i}));
                window.scrollTo(0, 0);}}>{i}</button>)
        }
        return result;
    }

    return (
        <div>
            {isNull ? (
                <p className="text-danger mt-4">❌ "검색 결과가 없습니다.</p>
            ) : (
                //<div>{movieList}</div>
                <div className="card-text text-light">
                    {/*{JSON.stringify(list)}*/}
                    {movieList}
                    <Pagediv/>
                </div>

            )}
        </div>
    );
}

export default Result;