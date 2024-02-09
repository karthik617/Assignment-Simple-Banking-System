import https from '../config/https.js'

const Login = ({setLoggedIn, setData}) => {
    const handeleLogin = (e) => {
        e.preventDefault()
        let loginData = {
            email: document.getElementById('exampleInputEmail1').value,
            password: document.getElementById('exampleInputPassword1').value,
        }
        https.post('/login',loginData).then((response) => {
            console.log(response);
            if(response.data.statusCode && response.data.message === "User retrieved") {
                localStorage.setItem('token', response.data.data.token)
                setData(response.data.data.user)
                setLoggedIn(true)
            }
        }).catch(err => console.log(err))
    }
    return <>
    <div className="container d-flex justify-content-center align-items-center">
        <form onSubmit={(e) => handeleLogin(e)}>
            <div className="form-group">
                <label htmlFor="exampleInputEmail1">Email address</label>
                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" name="email"/>
            </div>
            <div className="form-group">
                <label htmlFor="exampleInputPassword1">Password</label>
                <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" name="password"/>
            </div>
            
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
        </div>
    </>
}

export default Login;