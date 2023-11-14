import { Helmet } from "react-helmet";
import api from "../../services/api";
import url from "../../services/url";
import { toast } from "react-toastify";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
function ResetPassword() {
    const { resetToken } = useParams();
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        newPassword: "",
    });

    const [formErrors, setFormErrors] = useState({
        email: "",
        newPassword: "",
    });

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setFormErrors({ ...formErrors, [name]: "" });
    };

    const isEmailValid = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = {};

        if (!formData.email) {
            valid = false;
            newErrors.email = "Please enter your email.";
        } else if (!isEmailValid(formData.email)) {
            valid = false;
            newErrors.email = "Please enter a valid email address.";
        }

        if (!formData.newPassword) {
            newErrors.newPassword = "Please enter a new password.";
            valid = false;
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = "New password must be at least 6 characters.";
            valid = false;
        } else if (formData.newPassword.length > 50) {
            newErrors.newPassword = "New password must be less than 50 characters.";
            valid = false;
        }

        setFormErrors(newErrors);

        return valid;
    };

    const submitResponse = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                const { email, newPassword } = formData;
                const restPasswordResponse = await api.post(url.AUTH.RESET_PASSWORD + `/${resetToken}`, { email, newPassword });

                if (restPasswordResponse.status === 200) {
                    toast.success("Password reset successful. Please login again.", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 5000,
                    });

                    navigate("/login");
                } else {
                    toast.error("Error! An error occurred. Please try again later.", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 5000,
                    });
                }
            } catch (error) {
                toast.error("Error! An error occurred. Please try again later.", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 5000,
                });
            }
        }
    };
    return (
        <>
            <Helmet>
                <title>Reset Password | Examonimy</title>
            </Helmet>
            <div class="main-wrapper login-body">
                <div class="login-wrapper">
                    <div class="container">
                        <div class="loginbox">
                            <div class="login-left">
                                <img class="img-fluid" src="assets/img/login.png" alt="Logo" />
                            </div>
                            <div class="login-right">
                                <div class="login-right-wrap">
                                    <h1>Reset Password</h1>
                                    <p class="account-subtitle">Let Us Help You</p>

                                    <form onSubmit={submitResponse}>
                                        <div class="form-group">
                                            <label htmlFor="email">
                                                Enter your registered email address <span class="login-danger">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                className={`form-control ${formErrors.email ? "is-invalid" : ""}`}
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                            {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                                        </div>

                                        <div className={`form-group form-group-2${formErrors.password ? "is-invalid" : ""}`}>
                                            <div className="form-group">
                                                <label>
                                                    New Password <span className="login-danger">*</span>
                                                </label>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    name="newPassword"
                                                    id="newPassword"
                                                    className={`form-control ${formErrors.newPassword ? "is-invalid" : ""}`}
                                                    value={formData.newPassword}
                                                    onChange={handleChange}
                                                />
                                                {formErrors.newPassword && <div className="invalid-feedback">{formErrors.newPassword}</div>}
                                                {!formErrors.newPassword && (
                                                    <span className="profile-views" onClick={handleTogglePassword}>
                                                        {showPassword ? <i className="fa fa-eye-slash"></i> : <i className="fa fa-eye"></i>}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <button class="btn btn-primary btn-block" type="submit">
                                                Reset My Password
                                            </button>
                                        </div>
                                        <div class="form-group mb-0">
                                            <Link to="/login" class="btn btn-primary primary-reset btn-block">
                                                Login
                                            </Link>
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

export default ResetPassword;
