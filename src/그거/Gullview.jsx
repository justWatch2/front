
import './Gullist.css';
import {useEffect, useState} from "react";
import axios from "axios";

function Gullview() {
    useEffect(() => {

        axios.get('/testt/data')
            .then(response => {
                let d=response.data;
                let table=document.getElementById("aa");
                table.innerHTML=d;
            })
            .catch(response => console.log(response))
    }, []);

    return (
        <main>
            <p id="aa">fasfas</p>

        </main>
    );
}

export default Gullview;
