import { Helmet } from "react-helmet";
function ForgotPassword() {
    return (
        <>
            <Helmet>
                <title>ForgotPassword | Examonimy</title>
            </Helmet>
                <div className="main-wrapper login-body">
                    <div className="login-wrapper">
                        <div className="container">
                            <div className="loginbox">
                                <div className="login-left">
                                    <img className="img-fluid" src="assets/img/login.png" alt="Logo" />
                                </div>
                                <div className="login-right">
                                    <div className="login-right-wrap">
                                        <h1>Reset Password</h1>
                                        <p className="account-subtitle">Let Us Help You</p>

                                        <form action="https://preschool.dreamguystech.com/template/login.html">
                                            <div className="form-group">
                                                <label>
                                                    Enter your registered email address <span className="login-danger">*</span>
                                                </label>
                                                <input className="form-control" type="text" />
                                                <span className="profile-views">
                                                    <i className="fas fa-envelope"></i>
                                                </span>
                                            </div>
                                            <div className="form-group">
                                                <button className="btn btn-primary btn-block" type="submit">
                                                    Reset My Password
                                                </button>
                                            </div>
                                            <div className="form-group mb-0">
                                                <button className="btn btn-primary primary-reset btn-block" type="submit">
                                                    Login
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
          
        </>
    );
}

export default ForgotPassword;
