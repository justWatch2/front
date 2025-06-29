import { useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { RecommendationContext } from '../RecommendationContext';

const DefaultPostersFetcher = () => {
    const { setDefaultPosters } = useContext(RecommendationContext);
    const cacheRef = useRef([]);

    const fetchDefaultPosters = async () => {
        try {
            const requests =[
                axios.get('https://api.themoviedb.org/3/trending/movie/day', {params: {api_key: process.env.REACT_APP_TMDB_API_KEY, language: 'ko'}}),
                axios.get('https://api.themoviedb.org/3/trending/tv/day',{params: {api_key: process.env.REACT_APP_TMDB_API_KEY,language: 'ko'}}),
                axios.get('https://api.themoviedb.org/3/movie/upcoming',{params: {api_key: process.env.REACT_APP_TMDB_API_KEY,language: 'ko',region:'kr'}}),
                axios.get('https://api.themoviedb.org/3/movie/upcoming',{params: {api_key: process.env.REACT_APP_TMDB_API_KEY,language: 'ko',region:'us'}}),
            ]
            // const trending = res.data.results;

            const responses = await Promise.all(requests);
            const allArr = responses.map((res , index)=>{
                const keys = ['trend','trendTV','upComingMovieKr','upComingMovieUs'];
                const labels = ['요즘 인기있는 영화','요즘 인기있는 TV','개봉예정 한국 영화','개봉예정 해외 영화'];
                return{
                    key:res,
                    label:labels[index],
                    movies:res.data.results,
                };
            });

            // const allArr = [
            //     { key: 'trend', label: '트랜드 영화', movies: trending },
            //     {key:'trend',label:'트랜드 TV', movies: trending },
            //
            // ];


            cacheRef.current = allArr;

            setDefaultPosters(allArr);

        } catch (error) {
            console.error('Error fetching default posters:', error);
        }
    };

    useEffect(() => {
        fetchDefaultPosters();

        const intervalId = setInterval(() => {
            fetchDefaultPosters();
        }, 600 * 1000); // 1분마다 갱신 //10분

        return () => clearInterval(intervalId);
    }, []);

    return cacheRef; // 이걸 MainContent에서 import해서 씀
};

export default DefaultPostersFetcher;
