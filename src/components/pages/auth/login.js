import { Helmet } from "react-helmet";
import api from "../../services/api";
import url from "../../services/url";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
function Login() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formStaff, setFormStaff] = useState({
        email: "",
        password: "",
    });

    const [formErrors, setFormErrors] = useState({
        email: "",
        password: "",
    });

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormStaff({ ...formStaff, [name]: value });
        setFormErrors({ ...formErrors, [name]: "" });
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = {};

        if (!formStaff.email) {
            newErrors.email = "Please enter your email address.";
            valid = false;
        }

        if (!formStaff.password) {
            newErrors.password = "Please enter your password.";
            valid = false;
        } else if (formStaff.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
            valid = false;
        } else if (formStaff.password.length > 50) {
            newErrors.password = "Password must be less than 50 characters.";
            valid = false;
        }

        setFormErrors(newErrors);
        return valid;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                    },
                };
                const loginResponse = await api.post(url.AUTH.LOGIN, formStaff, config);
                if (loginResponse.data.success) {
                    const token = loginResponse.data.data;
                    localStorage.setItem("accessToken", token);

                    // Extract user role from the token
                    const decodedToken = JSON.parse(atob(token.split(".")[1]));
                    const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

                    // Determine the redirect URL based on the user's role
                    let redirectUrl = "/";
                    if (userRole === "Staff") {
                        redirectUrl = "/exam-list";
                    } else if (userRole === "Teacher") {
                        redirectUrl = "/teacher-dashboard";
                    }

                    navigate(redirectUrl);
                } else {
                    setFormErrors({
                        email: "Invalid email or password.",
                        password: "Invalid email or password.",
                    });
                }
            } catch (error) {
                setFormErrors({
                    email: "Invalid email or password.",
                    password: "Invalid email or password.",
                });
            }
        }
    };

    return (
        <>
            <Helmet>
                <title>Login | Examonimy Admin</title>
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
                                    <h1>Welcome to Examonimy Admin</h1>
                                    <p className="account-subtitle">Login to your account</p>
                                    <h2>Sign in</h2>

                                    <form onSubmit={handleLogin}>
                                        <div className={`form-group ${formErrors.email ? "is-invalid" : ""}`}>
                                            <div className="form-group">
                                                <label>
                                                    Email Address <span className="login-danger">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    className={`form-control ${formErrors.email ? "is-invalid" : ""}`}
                                                    value={formStaff.email}
                                                    onChange={handleChange}
                                                />
                                                {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                                            </div>
                                        </div>
                                        <div className={`form-group form-group-2 ${formErrors.password ? "is-invalid" : ""}`}>
                                            <div className="form-group">
                                                <label>
                                                    Password <span className="login-danger">*</span>
                                                </label>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    id="password"
                                                    className={`form-control ${formErrors.password ? "is-invalid" : ""}`}
                                                    value={formStaff.password}
                                                    onChange={handleChange}
                                                />
                                                {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}
                                                {!formErrors.password && (
                                                    <span className="profile-views" onClick={handleTogglePassword}>
                                                        {showPassword ? <i className="fa fa-eye-slash"></i> : <i className="fa fa-eye"></i>}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="forgotpass">
                                            <div className="remember-me">
                                                <label className="custom_check mr-2 mb-0 d-inline-flex remember-me">
                                                    Remember me
                                                    <input type="checkbox" name="radio" />
                                                    <span className="checkmark"></span>
                                                </label>
                                            </div>
                                            <Link to="/forgot-password">Forgot Password?</Link>
                                        </div>
                                        <div className="form-group">
                                            <button className="btn btn-primary btn-block" type="submit">
                                                Login
                                            </button>
                                        </div>
                                    </form>

                                    <div className="login-or">
                                        <span className="or-line"></span>
                                        <span className="span-or">or</span>
                                    </div>

                                    <div className="social-login">
                                        <a href="#!">
                                            <i className="fab fa-google-plus-g"></i>
                                        </a>
                                        <a href="#!">
                                            <i className="fab fa-facebook-f"></i>
                                        </a>
                                        <a href="#!">
                                            <i className="fab fa-twitter"></i>
                                        </a>
                                        <a href="#!">
                                            <i className="fab fa-linkedin-in"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Login;
