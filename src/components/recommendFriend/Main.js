import Banner from "./Banner";
import Row from "./Row";
import requests from "../../api/requests";
import Footer from "./Footer";
import React from "react";



export default function Main(){

    return (
        <div style={{ marginTop: "-50px" }}>
            <Banner/>
            <Row title="NETFLIX ORIGINALS" id="NO" fetchUrl={requests.fetchNetFlixOriginals} isLargeRow />
            <Row title="Trending Now" id="TN" fetchUrl={requests.fetchTrending} />
            <Row title="Top Rated" id="TR" fetchUrl={requests.fetchTopRated} />
            <Row title="Action Movies" id="AM" fetchUrl={requests.fetchActionMovies} />
            <Row title="Comedy Movies" id="CM" fetchUrl={requests.fetchComedyMovies} />
            <Footer />
        </div>
    )
}