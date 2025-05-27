
function MovieView({results}) {
    alert(JSON.stringify(results));
    if(results===undefined){
        return ;
    }
   return (
     <div>
         {results?.result.map((res)=>{
            let title=res["title"];
            let overview=res["overview"];
            return (
                <div>
                <p>title: {title}</p>
                    <p>overview: {overview}</p></div>
            )
         })}

     </div>
   );
}
export default MovieView;