
import "./Row.css";
import LazyYoutube from "./LazyYoutube.jsx";
import poster from "./assets/blank-poster-template-.jpg"

export default function Row({ data,title,fetchUrl}){
    //const [movies, setMovies] = useState(movie);
    const { id}={ id:title,};


    return (
        <section className="detail_row">
            <h2 className="detail_h2">{title}</h2>
            <div className="detail_slider">
                <div className="detail_slider__arrow-left"  onClick={() => {
                    document.getElementById(id).scrollLeft -= window.innerWidth *0.75;
                }}>
            <span
                className="detail_arrow"

            >
            {"<"}
            </span>
                </div>
                <div id={id} className="detail_row__posters">
                    {data?.map((movie,index) => (
                        title==="관련 동영상" ? <LazyYoutube key={index} videoId={movie.key} title={movie.name}></LazyYoutube>
                        :movie.known_for_department==="Acting" ? <div key={index}><img
                            key={movie.key}
                            className={`detail_row__poster`}
                            src={movie.profile_path!=null?fetchUrl+movie.profile_path:poster}
                            alt={movie.title}
                            />{movie.name}</div>:<></>
                    ))}
                </div>
                <div className="detail_slider__arrow-right"  onClick={() => {
                    document.getElementById(id).scrollLeft += window.innerWidth *0.75;
                }}>
            <span
                className="detail_arrow"

            >
            {">"}
            </span>
                </div>
            </div>
        </section>
    )
}
