import axios from "axios";
import qs from "qs";

export async function LoadMovie(flag,data,text,signal) {
    const {genres,adult,years,korea,page}=data;
    const title=text.replaceAll(" ","* ")+"*";
    const genresData = genres?.map((item)=>item.id)
    const yearsData = years.map((item)=>item.PARTITION)
    const url=flag ? '/api/TV_shows/search': '/api/movie/search';

    const options = {
        method: 'GET',
        url: url,
        headers:{
            accept: 'application/json',
       },
        signal,
        params:{
            title:title,
            genres:genresData,
            adult:adult,
            years:yearsData,
            korea: korea,
            korean:/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(title),
            page:page,
            memberId:'a',
        },
        paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: "comma" });
        }
    };

    const response= await axios.request(options);

    //alert(JSON.stringify(response.data));


    return {
        ...response,
        category: flag,
    };
}