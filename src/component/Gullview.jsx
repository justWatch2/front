import {useParams} from "react-router";
import {useEffect, useState} from "react";
import axios from "axios";


export const Gullview=()=>{
    const {no}=useParams();
    const [title,setTitle]=useState('');
    const [content,setContent]=useState('');
    const [image,setImage]=useState('');

    useEffect(()=>{
        axios.get('/team/viewpost?no='+no)
            .then(response => {


            })
            .catch(response => console.log(response))
    },[])


    return (<div>aaaa{no}</div>);
}