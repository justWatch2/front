import {useEffect, useState} from "react";
import {useNavigate} from "react-router";

function Result({list}){
    const [isNull,setIsNull] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if(list!=null){
            setIsNull(false);
        }else{
            setIsNull(true);
        }
    }, [list]);


    function handleClickMovie(id){
        navigate('/movie/'+id);
    }

    const movieList = list?.data?.results?.map((res, index) => (
        <div key={index} className="card bg-dark text-light mb-4 border-light shadow" onClick={() => handleClickMovie(res.id)} style={{ cursor: 'pointer' }}>

            <div className="row g-0">
                <div className="col-md-3">
                    <img
                        src={`https://image.tmdb.org/t/p/w200/${res.poster_path}`}
                        alt={res.title}
                        className="img-fluid rounded-start h-100 object-fit-cover"
                    />
                </div>
                <div className="col-md-9">
                    <div className="card-body">
                        <h5 className="card-title text-info">🎬 {res.title}</h5>
                        <p className="card-text text-light">
                            <strong>줄거리:</strong> {res.overview || "내용 없음"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    ));


    return (
        <div>
            {isNull ? (
                <div>{movieList}</div>
            ) : (
                <p className="text-danger mt-4">❌ "검색 결과가 없습니다.</p>
            )}
        </div>
    );
}

export default Result;