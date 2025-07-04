import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Row from "./Row.jsx";
import watcha from "./assets/watcha.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import styles from "./Detail.module.css";
import {autoRefreshCheck} from "../../tokenUtils/TokenUtils.js";
function Detail() {
    const { category, id } = useParams();
    const [contents, setContents] = useState(null);
    const [wish, setWish] = useState(false);
    const [view, setView] = useState(false);
    const navigate = useNavigate();
    const [dependency, setDependency] = useState([]);
    const token = localStorage.getItem("jwt");

    useEffect(
        ()=>{
            window.scrollTo(0,0);

        },[]
    );


    useEffect(() => {
        const load= async ()=>{
            const urlBase = category === "movie" ? "movie" : "tv";
            const res = await axios.request({
                method: 'GET',
                url: `https://api.themoviedb.org/3/${urlBase}/${id}`,
                params: {
                    append_to_response: 'videos,credits,watch/providers',
                    language: 'ko-KR'
                },
                headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YjA3MGM5ODk0MTY0MTFhNTEzYzRjNmM3OGFmMDc2OSIsIm5iZiI6MTc0NzIxODk4NS44Miwic3ViIjoiNjgyNDcyMjk0OTMzZmUxNDU1MzMzZjM4Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.rBrd8bY3jM-JG5YfEsj_A6ApxP3KpzZQpw9yyGnRuUw'
                }
            });

            const commonData = {
                ...res.data,
                title: category === "movie" ? res.data.title : res.data.name,
                original_title: category === "movie" ? res.data.original_title : res.data.original_name,
                release_date: category === "movie" ? res.data.release_date : res.data.first_air_date,
                vote: res.data.vote_average,
                voteCount: res.data.vote_count,
            };

            // 기본 정보 설정
            setContents(commonData);

            // 추가적으로 IMDb 평점 보정 (movie일 경우만)
            if (category === "movie" && res.data.imdb_id) {
                try {
                    const voteRes = await axios.get(`/api/non-member/vote/${res.data.imdb_id}`);
                    setContents(prev => ({
                        ...prev,
                        vote: voteRes.data.averageratings ?? prev.vote,
                        voteCount: voteRes.data.numVotes ?? prev.voteCount,
                    }));
                } catch (voteError) {
                    console.error("IMDb 평점 불러오기 실패:", voteError);
                }
            }
        }

        load();
    }, [category, id]);

    useEffect(() => {
        if (contents)
            axios.get(`/api/non-member/dependency/${contents.title}/${/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(contents.original_title)}`)
                .then(res => setDependency(res.data));
    }, [contents]);

    useEffect(() => {
        const loaddetail= async()=>{
            const Config={
            method:"GET",
            url:`/api/detail/${category}/${id}`
            };
        const res= await autoRefreshCheck(Config,"");
        if(res?.data){
            setView(res.data.view)
            setWish(res.data.wish)
            }
        }
        loaddetail();
        // axios.get(`/api/view/${category}/${id}`)
        //     .then(res => setView(res.data));
        // axios.get(`/api/wish/${category}/${id}`)
        //     .then(res => setWish(res.data));
    }, [category, id]);

    const viewHandler = async() => {
    
        if (token) {
            if (view) {
                setView(false);
                const config={
                    method:'DELETE',
                    url:`/api/view/${category}/${id}`,
                };
                const res=await autoRefreshCheck(config)
                if(res?.status!=200){
                    alert("통신 에러")
                    setView(true);
                }
                // axios.delete(`/api/view/${category}/${id}`)
                //     .then(() => setView(false))
                //     .catch(err => console.error(err));
            } else {
                setView(true);
                const config={
                    method:'POST',
                    url:`/api/view`,
                    data:{
                        category: category,
                        id: id
                    }
                };
                const res=await autoRefreshCheck(config)
                if(res?.status!=200){
                     alert("통신 에러")
                    setView(false);
                }
                // axios.post("/api/view", {
                //     memberId: memberId,
                //     category: category,
                //     id: id
                // }).then(() => setView(true))
                //     .catch(err => console.error(err));
            }
        } else {
            alert("로그인후 사용가능");
            setView(false);
        }
    };

    const wishHandler = async () => {
        if (token) {
            if (wish) {
                setWish(false);
                const config={
                    method:'DELETE',
                    url:`/api/wish/${category}/${id}`,
                };
                const res=await autoRefreshCheck(config)
                if(res?.status!=200){
                    setWish(true);
                }
                // axios.delete(`/api/wish/${memberId}/${category}/${id}`)
                //     .then(() => setWish(false))
                //     .catch(err => console.error(err));
            } else {
                setWish(true);
                const config={
                    method:'POST',
                    url:`/api/wish`,
                    data:{
                        category: category,
                        id: id
                    }
                };
                const res=await autoRefreshCheck(config)
                if(res?.status!=200){
                    setWish(false);
                }
                // axios.post("/api/wish", {
                //     memberId: memberId,
                //     category: category,
                //     id: id
                // }).then(() => setWish(true))
                //     .catch(err => console.error(err));
            }
        } else {
            alert("로그인후 사용가능");
            setWish(false);
        }
    };

    const { fullStars, hasHalfStar, emptyStars } = calculateRating(contents?.vote);

    const renderProviders = (providers) => {
        if (!providers || providers.length === 0) return null;

        return (
            <div className={styles.providerIcons}>
                {providers.map((item, index) => (
                    <img
                        key={index}
                        src={item.provider_name === "Watcha" ? watcha : `https://image.tmdb.org/t/p/original${item.logo_path}`}
                        alt={item.provider_name}
                        style={{ width: '40px', height: '40px', borderRadius: "5px" }}
                        title={item.provider_name}
                    />
                ))}
            </div>
        );
    };

    if (!contents) return <h3 className={styles.textLight}>로딩 중...</h3>;

    return (
        <div className={styles.detailWrapper}>
            {contents.backdrop_path != null ? (
                <div
                    style={{
                        backgroundImage: `linear-gradient(to top, rgba(17, 17, 17, 1) 20%, rgba(255, 255, 255, 0.0)), url(https://image.tmdb.org/t/p/original${contents.backdrop_path})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        height: "500px",
                        width: '100%',
                        marginBottom: "-200px",
                        marginTop: "-45px"
                    }}
                />
            ) : <></>}

            <div className={styles.detailContainer}>
                <div className={styles.detailHeader}>
                    <div className={styles.posterContainer}>
                        <img src={`https://image.tmdb.org/t/p/w300${contents.poster_path}`} alt={contents.title} className={styles.detailPoster} />
                        <div className={styles.detailButtons}>
                            <button
                                className={wish ? styles.activeWish : ""}
                                onClick={wishHandler}
                            >
                                <FontAwesomeIcon icon={faHeart} /> 찜
                            </button>
                            <button
                                className={view ? styles.activeView : ""}
                                onClick={viewHandler}
                            >
                                <FontAwesomeIcon icon={faCheck} /> 시청한 작품
                            </button>
                        </div>
                    </div>
                    <div className={styles.detailInfo}>
                        <h2 className={styles.detailTitle}>{contents.title}</h2>
                        <p className={styles.detailOverview}>개요: {contents.overview}</p>
                        <p className={styles.detailRelease}>개봉일: {contents.release_date}</p>
                        <p className={styles.detailRating}>
                            평점:
                            {Array(fullStars)
                                .fill()
                                .map((_, i) => (
                                    <span key={`full-${i}`} className={styles.star}><FaStar /></span>
                                ))}
                            {hasHalfStar && <span className={styles.star}><FaStarHalfAlt /></span>}
                            {Array(emptyStars)
                                .fill()
                                .map((_, i) => (
                                    <span key={`empty-${i}`} className={styles.star}><FaRegStar /></span>
                                ))}
                            <span className={styles.ratingScore}>{contents.vote}({contents.voteCount})</span>
                        </p>
                    </div>
                </div>
                <div className={styles.detailProviderSection}>
                    {renderProviders(contents['watch/providers']?.results?.KR?.flatrate) && (
                        <div className={styles.detailProvider}>
                            <p className={styles.detailProviderTitle}>구독:</p>
                            {renderProviders(contents['watch/providers']?.results?.KR?.flatrate)}
                        </div>
                    )}
                    {renderProviders(contents['watch/providers']?.results?.KR?.rent) && (
                        <div className={styles.detailProvider}>
                            <p className={styles.detailProviderTitle}>대여:</p>
                            {renderProviders(contents['watch/providers']?.results?.KR?.rent)}
                        </div>
                    )}
                    {renderProviders(contents['watch/providers']?.results?.KR?.buy) && (
                        <div className={styles.detailProvider}>
                            <p className={styles.detailProviderTitle}>구매:</p>
                            {renderProviders(contents['watch/providers']?.results?.KR?.buy)}
                        </div>
                    )}
                    {renderProviders(contents['watch/providers']?.results?.KR?.free) && (
                        <div className={styles.detailProvider}>
                            <p className={styles.detailProviderTitle}>무료:</p>
                            {renderProviders(contents['watch/providers']?.results?.KR?.free)}
                        </div>
                    )}
                    {renderProviders(contents['watch/providers']?.results?.KR?.ads) && (
                        <div className={styles.detailProvider}>
                            <p className={styles.detailProviderTitle}>광고:</p>
                            {renderProviders(contents['watch/providers']?.results?.KR?.ads)}
                        </div>
                    )}
                </div>
                {/* <hr /> */}
                {contents?.videos?.results?.length > 0 ? (
                    <Row data={contents?.videos?.results}
                         title={"관련 동영상"}
                         fetchUrl={""}
                    ></Row>
                ) : <br />}
                {/* <hr /> */}
                {contents?.credits?.cast?.length > 0 ? (
                    <Row data={contents?.credits?.cast}
                         title={"출연진"}
                         fetchUrl={"http://image.tmdb.org/t/p/w185"}
                    ></Row>
                ) : <br />}
                {dependency?.length > 0 ? (
                    <div className={styles.relatedPosts}>
                        <h2>연관 게시글</h2>
                        {dependency.map((item) => (
                            <div className={styles.relatedPost} key={item.no}>
                                <Link to={`/post/${item.no}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className={styles.card}>
                                        <div className={styles.cardBody}>
                                            <h5 className={styles.relatedPostTitle}>{item.title}</h5>
                                            <p className={styles.relatedPostContent}>{item.contents}</p>
                                            <div className={styles.relatedPostMore}>자세히 보기 →</div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : <br />}
                <button onClick={() => navigate(-1)} className={styles.backButton}>뒤로가기</button>
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
        rating = (voteAverage / 2).toFixed(1);
        fullStars = Math.floor(rating);
        hasHalfStar = rating - fullStars >= 0.2;
        emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    } else {
        console.log('Invalid or no vote_average:', voteAverage);
    }

    return { fullStars, hasHalfStar, emptyStars };
};