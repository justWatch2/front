import axios from "axios"; // ✅ 옳은 방법


const instance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: "288b96c1921a0a2af76c4184e1241ef5",
    language: "ko-KR",
  },
});
export default instance;