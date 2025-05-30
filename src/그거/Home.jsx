
import './Home.css';

function Home() {

    return (
        <main id="home">
            <Load />

        </main>
    );
}

function Load(){

    let id="";
    if(id==null || id===""){
        return(
            <form action="/team/login" method="POST">
                <table className="login" id="login">
                    <tbody>
                    <tr><td colSpan='2'>로그인</td></tr>

                    <tr>
                        <td>ID</td>
                        <td><input id="id" name="id" /></td>
                        <td rowSpan='2'><input type="submit" value="로그인" id="lib" onClick="loginck()" /></td>
                    </tr>
                    <tr><td>PW</td><td><input id="pw" name="pass" /></td></tr>
                    <tr><td colSpan='3'><input type="button" value="회원가입" id="sign" onClick="gosign()" /></td></tr>
                    </tbody>
                </table>
            </form>
        )
    }else{
        return (
            <table className="login" id="my">
                <tbody>
                <tr><td colSpan='2'>내 정보</td></tr>
                <tr><td>ID</td><td id="lid"></td></tr>
                <tr><td>이름</td><td id="lname"></td></tr>
                <tr><td colSpan='3'><input type="button" onClick="logout()" value="로그아웃" /></td></tr>
                </tbody>
            </table>
        )
    }
}

export default Home;
