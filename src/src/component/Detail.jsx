import axios from "axios";
import {useLocation, useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import YouTube from "react-youtube";
import LazyYoutube from "./LazyYoutube.jsx";
import Row from "./Row.jsx";
import watcha from "../assets/watcha.jpg"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import styled from "styled-components";

const StarSection = styled('p')`
    .star {
        color : goldenrod;
    }
`;

function Detail(){
    const location = useLocation();
    const { category,id } = useParams();
    const [contents, setContents] = useState(null);
    const [wish, setWish] = useState(false);
    const [view, setView] = useState(false);
    const [isLogin,setIsLogin] = useState(true);
    const [memberId, setMemberId] = useState("a");
    const navigate = useNavigate();
    //const vote = location.state.averagerating;
    //const voteCount = location.state.numVotes;
    const [dependency, setDependency] = useState([]);

const vote=7,voteCount=4556;


    useEffect(() => {
        const options = category=="movie" ? {
            method: 'GET',
            url: 'https://api.themoviedb.org/3/movie/'+id,
            params: {
                append_to_response: 'videos,credits,watch/providers',
                language: 'ko-KR'
            },
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YjA3MGM5ODk0MTY0MTFhNTEzYzRjNmM3OGFmMDc2OSIsIm5iZiI6MTc0NzIxODk4NS44Miwic3ViIjoiNjgyNDcyMjk0OTMzZmUxNDU1MzMzZjM4Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.rBrd8bY3jM-JG5YfEsj_A6ApxP3KpzZQpw9yyGnRuUw'
            }
        }:
            {
                method: 'GET',
                url: 'https://api.themoviedb.org/3/tv/'+id,
                params: {
                    append_to_response: 'videos,credits,providers',
                    language: 'ko-KR'
                },
                headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YjA3MGM5ODk0MTY0MTFhNTEzYzRjNmM3OGFmMDc2OSIsIm5iZiI6MTc0NzIxODk4NS44Miwic3ViIjoiNjgyNDcyMjk0OTMzZmUxNDU1MzMzZjM4Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.rBrd8bY3jM-JG5YfEsj_A6ApxP3KpzZQpw9yyGnRuUw'
                }
            };
        axios
            .request(options)
            .then(res => {setContents({
                ...res.data,
                title:category==="movie"?res.data.title:res.data.name,
                original_title:category==="movie"?res.data.original_title:res.data.original_name,
                release_date:category==="movie"?res.data.release_date:res.data.first_air_date,
                });
            })
            .catch(err => console.error(err));
    },[category, id]);

    useEffect(() => {
        if(contents)
            axios.get(`/api/dependency/${contents.title}/${contents.original_title}`).then(res=>setDependency(res.data));
    }, [contents]);

    useEffect(() => {

        axios.get(`/api/view/${memberId}/${category}/${id}`).then(res=>setView(res.data));
        axios.get(`/api/wish/${memberId}/${category}/${id}`).then(res=>setWish(res.data));

    }, [category, id, memberId]);

    const viewHandler=() => {
        if(isLogin){
            if(view){
                axios.delete(`/api/view/${memberId}/${category}/${id}`)
                .then(() => setView(false))
                .catch(err => console.error(err));
            }else{
                axios.post("/api/view", {
                    memberId:memberId,
                    category:category,
                    id:id
                }).then(() => setView(true)
                ).catch(err => console.error(err));
            }
        }else{
            alert("로그인후 사용가능");
            setView(false);
        }
    };
    const wishHandler=()=>{
        if(isLogin){
            if(wish){
                axios.delete(`/api/wish/${memberId}/${category}/${id}`)
                    .then(() => setWish(false))
                    .catch(err => console.error(err));
            }else{
                axios.post("/api/wish", {
                    memberId:memberId,
                    category:category,
                    id:id
                }).then(() => setWish(true)
                ).catch(err => console.error(err));
            }
        }else{
            alert("로그인후 사용가능");
            setWish(false);
        }
    }

    const { rating, fullStars, hasHalfStar, emptyStars } =
        calculateRating(vote);

    const renderProviders = (providers) => {
        if (!providers || providers.length === 0) return null;

        return (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                {providers.map((item, index) => (
                    <img
                        key={index}
                        src={item.provider_name==="Watcha" ? watcha:`https://image.tmdb.org/t/p/original${item.logo_path}`} // fallback
                        alt={item.provider_name}
                        style={{ width: '40px', height: '40px' ,borderRadius:"5px "}}
                        title={item.provider_name} // hover 시 이름 표시
                    />
                ))}
            </div>
        );
    };

    if (!contents) return <div className="text-light">로딩 중...</div>;
    return (<div className="bg-black text-light min-vh-100 py-5">
            {/*{JSON.stringify(contents)}*/}
        {contents.backdrop_path!=null ? <div                 style={{backgroundImage: `linear-gradient(to top, rgba(0,0,0,1) 20%,rgba(255,255,255,0.0)),
                 url(https://image.tmdb.org/t/p/original${contents.backdrop_path})`
                ,backgroundRepeat: 'no-repeat'
                ,backgroundSize: 'cover',backgroundPosition: 'center'
                ,height:"500px", width:'100%' ,marginBottom:"-200px", marginTop:"-45px"


            }} />:<></>}

            <div className="container">
                <div className="d-flex">
                    <img src={`https://image.tmdb.org/t/p/w300${contents.poster_path}`} alt={contents.title} className="me-4 h-75" />
                    <div  >
                        <h2>{contents.title}</h2>

                        <p><strong>개요:</strong> {contents.overview}</p>
                        <p><strong>개봉일:</strong> {contents.release_date}</p>
                        <StarSection style={{display: 'flex',
                            alignItems: 'center',
                            gap: '2px'}}>
                            <strong>평점:&nbsp;</strong>
                            {Array(fullStars)
                                .fill()
                                .map((_, i) => (
                                    <span key={`full-${i}`} className="star"><FaStar /></span>
                                ))}
                            {hasHalfStar && <span className="star"><FaStarHalfAlt/></span>}
                            {Array(emptyStars)
                                .fill()
                                .map((_, i) => (
                                    <span key={`empty-${i}`} className="star"><FaRegStar /></span>
                                ))}
                            <span className="rating-score">{vote}({voteCount})</span>
                        </StarSection>

                        {/*{JSON.stringify(contents['watch/providers'].results?.KR)}*/}
                        <div className="row row-cols-2" style={{ gap: "20px", alignItems: "flex-start" }}>
                        <div className=" row" style={{ flex:"1"}}>
                        {renderProviders(contents['watch/providers']?.results?.KR?.flatrate) && (
                            <div className="col border rounded-2 border-black bg-dark">
                                <p><strong>구독:</strong></p>
                                {renderProviders(contents['watch/providers']?.results?.KR?.flatrate)}
                            </div>
                        )}

                        {renderProviders(contents['watch/providers']?.results?.KR?.rent) && (
                            <div className="col border rounded-2 border-black bg-dark">
                                <p><strong>대여:</strong></p>
                                {renderProviders(contents['watch/providers']?.results?.KR?.rent)}
                            </div>
                        )}

                        {renderProviders(contents['watch/providers']?.results?.KR?.buy) && (
                            <div className="col border rounded-2 border-black bg-dark">
                                <p><strong>구매:</strong></p>
                                {renderProviders(contents['watch/providers']?.results?.KR?.buy)}
                            </div>
                        )}

                        {renderProviders(contents['watch/providers']?.results?.KR?.free) && (
                            <div className="col border rounded-2 border-black bg-dark">
                                <p><strong>무료:</strong></p>
                                {renderProviders(contents['watch/providers']?.results?.KR?.free)}
                            </div>
                        )}

                        {renderProviders(contents['watch/providers']?.results?.KR?.ads) && (
                            <div className="col border rounded-2 border-black bg-dark">
                                <p><strong>광고:</strong></p>
                                {renderProviders(contents['watch/providers']?.results?.KR?.ads)}
                            </div>
                        )}

                        </div>
                            <div className="col">
                                <div className="d-flex flex-column gap-2 float-end mt-5">
                                    <button
                                        className={wish ? "btn btn-danger":"btn btn-outline-light"}
                                        style={{ width: "150px", height: "50px", padding: "0", display: "flex", alignItems: "center", justifyContent: "center" }}
                                        onClick={wishHandler}
                                    >
                                        <FontAwesomeIcon icon={faHeart} />&nbsp;찜
                                    </button>
                                    <button
                                        className={view ? "btn btn-success":"btn btn-outline-light"}
                                        style={{ width: "150px", height: "50px", padding: "0", display: "flex", alignItems: "center", justifyContent: "center" }}
                                        onClick={viewHandler}

                                    >
                                        <FontAwesomeIcon icon={faCheck}/>
                                        &nbsp;시청한 작품
                                    </button>
                                </div>
                            </div>
                    </div>
                    </div>
                </div>
                <hr />
                {contents?.videos?.results?.length>0 ? <Row data={contents?.videos?.results}
                                                            title={"관련 동영상"}
                                                            fetchUrl={""}
                ></Row>:<br /> }
                <hr />
                {contents?.credits?.cast?.length>0 ? <Row data={contents?.credits?.cast}
                                                          title={"출연진"}
                                                          fetchUrl={"http://image.tmdb.org/t/p/w185"}
                ></Row>:<br /> }

                {dependency?.length > 0 ? (
                <div className="row">
                    <h2>연관 게시글</h2>
                    {
                        dependency.map((item) => (
                            <div className="col-sm-6 col-md-3 mb-4" key={item.no}>
                                <Link to={`/gullview/${item.no}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="card h-100 shadow-sm">
                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title border-bottom border-black">{item.title}</h5>
                                            <p className="card-text flex-grow-1">{item.contents}</p>
                                            <div className="mt-3 text-end text-primary">자세히 보기 →</div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                </div>):<br/>
                }

                <button onClick={()=>navigate(-1)} className="btn btn-outline-light mt-3">뒤로가기</button>
            </div>
        </div>
    );
}

export default Detail;

const calculateRating = (voteAverage) => {
    let rating = '0.0';
    let fullStars = 0;
    let hasHalfStar = false;
    let emptyStars = 5;

    if (typeof voteAverage === 'number' && !isNaN(voteAverage) && voteAverage > 0) {
        rating = (voteAverage / 2).toFixed(1); // 10점 만점을 5점 만점으로 변환
        fullStars = Math.floor(rating);
        hasHalfStar = rating - fullStars >= 0.2;
        emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    } else {
        console.log('Invalid or no vote_average:', voteAverage); // 디버깅
    }

    return { rating, fullStars, hasHalfStar, emptyStars };
};