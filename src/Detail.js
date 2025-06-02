import axios from "axios";
import {useParams} from "react-router";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import YouTube from "react-youtube";


function Detail(){
    const { id } = useParams();
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        const options = {
            method: 'GET',
            url: 'https://api.themoviedb.org/3/movie/'+id,
            params: {
                append_to_response: 'videos',
                language: 'ko-KR'
            },
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YjA3MGM5ODk0MTY0MTFhNTEzYzRjNmM3OGFmMDc2OSIsIm5iZiI6MTc0NzIxODk4NS44Miwic3ViIjoiNjgyNDcyMjk0OTMzZmUxNDU1MzMzZjM4Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.rBrd8bY3jM-JG5YfEsj_A6ApxP3KpzZQpw9yyGnRuUw'
            }
        };
        axios
            .request(options)
            .then(res => setMovie(res.data))
            .catch(err => console.error(err));


    },[id]);

    if (!movie) return <div className="text-light">로딩 중...</div>;
    return (<div className="bg-black text-light min-vh-100 py-5">
            <div className="container">
                <div className="d-flex">
                    <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} className="me-4" />
                    <div>
                        <h2>{movie.title}</h2>
                        <p><strong>개요:</strong> {movie.overview}</p>
                        <p><strong>개봉일:</strong> {movie.release_date}</p>
                        <p><strong>평점:</strong> {movie.vote_average}</p>
                    </div>
                </div>
                <YouTube
                    videoId = {movie.videos?.results[0]?.key }
                    //opts(옵션들): 플레이어의 크기나 다양한 플레이어 매개 변수를 사용할 수 있음.
                    //밑에서 더 설명하겠습니다.
                    opts={{
                        width: "560",
                        height: "315",
                        playerVars: {
                            autoplay: 0,
                        },
                    }}
                    //이벤트 리스너
                    onEnd={(e)=>{e.target.stopVideo(0);}}
                />
                <Link to={-1}><button>뒤로가기</button></Link>
            </div>
        </div>
    );
}

export default Detail;