import { useState } from "react";
import { LoadMovie } from "./LoadMovie";
import 'bootstrap/dist/css/bootstrap.min.css';
import {useNavigate} from "react-router";
import Header from "./Movie_Loginbar";


function App() {
    const [inputValue, setInputValue] = useState('');
    const [saveValue, setSaveValue] = useState('');
    const [results, setResults] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSearch = async () => {
        setSaveValue(inputValue);
        const response = await LoadMovie(inputValue);
        setResults(response);

    };

    function handleClickMovie(id){
        navigate('/movie/'+id);
    }

    const movieList = results?.data?.results?.map((res, index) => (
        <div key={index} className="card bg-dark text-light mb-4 border-light shadow" onClick={() => handleClickMovie(res.id)} style={{ cursor: 'pointer' }}>

            <div className="row g-0">
                <div className="col-md-3">
                    <img
                        src={`https://image.tmdb.org/t/p/w200/${res.poster_path}`}
                        alt={res.title}
                        className="img-fluid rounded-start h-100 object-fit-cover"
                    />
                </div>
                <div className="col-md-9">
                    <div className="card-body">
                        <h5 className="card-title text-info">🎬 {res.title}</h5>
                        <p className="card-text text-light">
                            <strong>줄거리:</strong> {res.overview || "내용 없음"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    ));

    return (

        <div className="bg-black min-vh-100 py-5">
            <Header/>
            <div className="container">
                <div className="text-center mb-5">
                    <h1 className="text-light display-4 fw-bold">🎥 영화 검색기</h1>
                    <p className="text-secondary">원하는 영화를 입력하고 정보를 확인해보세요!</p>
                </div>

                <div className="input-group input-group-lg mb-5 shadow-sm">
                    <input
                        type="text"
                        className="form-control bg-dark text-light border-secondary"
                        placeholder="영화 제목 입력"
                        value={inputValue}
                        onChange={handleChange}
                    />
                    <button className="btn btn-outline-info" onClick={handleSearch}>
                        검색
                    </button>

                </div>

                {saveValue && (
                    <h4 className="text-light mb-4">🔍 "{saveValue}"의 검색 결과</h4>
                )}

                {results?.data?.results?.length > 0 ? (
                    <div>{movieList}</div>
                ) : saveValue ? (
                    <p className="text-danger mt-4">❌ "{saveValue}"에 대한 검색 결과가 없습니다.</p>
                ) : null}
            </div>
        </div>
    );
}

export default App;
