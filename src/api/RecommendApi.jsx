import axios from "axios";
export const API_SERVER_HOST = "http://192.168.0.72:8080";
const prefix = `${API_SERVER_HOST}/rec`;

export const weatherRecommendApi = async (genresMovies, genresTV) => {
    try{

        const response = await axios.post(`${prefix}/weather`,{
            genresMovies,
            genresTV
        });

        console.log(response);
        return response;
    }catch (err){
        console.log(err);
        return;
    }

}
export const mbtiRecommendApi = async (genresMovies, genresTV) => {
    try{

        const response = await axios.post(`${prefix}/mbti`,{
            genresMovies,
            genresTV
        });
        console.log(response);
        return response;
    }catch (err){
        console.log(err);
        return;
    }
}
export const timeRecommendApi = async (genresMovies, genresTV) => {
    try{
        const response = await axios.post(`${prefix}/time`,{
            genresMovies,
            genresTV
        });
        console.log(response);
        return response;
    }catch (err){
        console.log(err);
        return;
    }
}

export const complexRecommendApi = async(payload)=>{
    try{
        const response = await axios.post(`${prefix}/complex`,payload
        )
        return response;
    }catch (err){
        console.log(err);
        return;
    }
}

export const MemberRecommendApi = async (payload)=>{
    try{
        const response = await axios.post(`${prefix}/user`,payload
        )

        console.log(response);
        return response;
    }catch (err){
        console.log(err);
        return;
    }
}
