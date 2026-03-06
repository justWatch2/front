import axios from "axios";
import {autoRefreshCheck} from '../../../tokenUtils/TokenUtils';
import { API_BASE_URL } from "../../../config/api";
const prefix = `${API_BASE_URL}/rec`;
const prefixuser = `${API_BASE_URL}/user`;


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
        const response = await autoRefreshCheck({
            method:'post',
            url:`${prefixuser}/userrec/async`,
            data:payload
        }
        )

        console.log(response);
        return response;
    }catch (err){
        console.log(err);
        return;
    }
}
