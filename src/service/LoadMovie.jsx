import axios from "axios";


export async function LoadMovie(flag,data,text) {
    const {genres,adult,years,korea}=data;
    const title="+"+text+'*';
    const genresData = genres?.map((item)=>item.name)
    const yearsData = years.map((item)=>item.PARTITION)
    const url=flag ? '/team/search/TV_shows/': '/team/search/movie/';

    const options = {
        method: 'GET',
        url: url,
        headers:{
            accept: 'application/json',
       },
        params:{
            title:title,
            genres:genres!=null ? genresData.join(" "):null,
            adult:adult,
            years:yearsData.join(),
            korea: korea,
            korean:/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(title),
        },
    };

    const response= await axios.request(options);

    // alert(JSON.stringify(response.data));


    return response;
}