import axios from "axios";
import qs from "qs";

export async function LoadMovie(flag,data,text,signal) {
    const {genres,adult,years,korea,page}=data;
    const title=text.replaceAll(" ","* ")+"*";
    const genresData = genres?.map((item)=>item.id)
    const yearsData = years.map((item)=>item.PARTITION)
    const url=flag ? '/api/non-member/TV_shows/search': '/api/non-member/movie/search';

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
        },
        paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: "comma" });
        }
    };

    try {
        
    const response = await axios.request(options);
    return {
      ...response,
      category: flag,
    };

  } catch (error) {
    if (error.name === "CanceledError" || axios.isCancel?.(error)) {
      // 요청이 취소되었으면 아무것도 안 함 (조용히 처리)
      console.log("요청이 취소되었습니다.");
      return null; // 또는 아무것도 안 넘김
    } else {
      // 진짜 오류는 throw로 던짐
      throw error;
    }
  }
}