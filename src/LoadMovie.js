import axios from "axios";
import {useState,useEffect } from "react";

export async function LoadMovie(text) {
    const options = {
        method: 'GET',
        url: 'https://api.themoviedb.org/3/search/movie?query='+text+'&language=ko-KR',
        async:false,
        headers:{
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YjA3MGM5ODk0MTY0MTFhNTEzYzRjNmM3OGFmMDc2OSIsIm5iZiI6MTc0NzIxODk4NS44Miwic3ViIjoiNjgyNDcyMjk0OTMzZmUxNDU1MzMzZjM4Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.rBrd8bY3jM-JG5YfEsj_A6ApxP3KpzZQpw9yyGnRuUw'
        }
    };

    const response= await axios.request(options);
    //alert(JSON.stringify(response.data));
    return response;
}