import { useState } from "react";
import { Helmet } from "react-helmet";
import api from "../../services/api";
import url from "../../services/url";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
function ForgotPassword() {
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
    });

    const [formErrors, setFormErrors] = useState({
        email: "",
    });

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

        setFormErrors(newErrors);

        return valid;
    };

    const submitResponse = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                setSubmitting(true);
                const { email } = formData;
                const restPasswordResponse = await api.post(url.AUTH.FORGOT_PASSWORD, { email });

                if (restPasswordResponse.status === 200) {
                    setFormSubmitted(true);

                    toast.success("Please check your email and follow the instructions.", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 5000,
                    });
                } else {
                    toast.error("Error! An error occurred. Please try again later", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 5000,
                    });
                }
            } catch (error) {
                setFormErrors({
                    email: "Email address does not exist.",
                });
            } finally {
                setSubmitting(false);
            }
        }
    };
    return (
        <>
            <Helmet>
                <title>Forgot Password | Examonimy</title>
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
                                    <h1>Forgot Password</h1>
                                    <p className="account-subtitle">Let Us Help You</p>

                                    <form onSubmit={submitResponse}>
                                        <div className="form-group">
                                            <label htmlFor="email">
                                                Enter your registered email address <span className="login-danger">*</span>
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

                                            {!formErrors.email && (
                                                <span className="profile-views">
                                                    <i className="fas fa-envelope"></i>
                                                </span>
                                            )}
                                        </div>
                                        <div className="form-group">
                                            {submitting && (
                                                <button type="button" className="btn btn-primary btn-block" disabled style={{ width: "100%" }}>
                                                    <i className="fa fa-spinner fa-spin"></i> Submitting...
                                                </button>
                                            )}

                                            {!submitting && !formSubmitted && (
                                                <>
                                                    <button className="btn btn-primary btn-block" type="submit">
                                                        Reset My Password
                                                    </button>
                                                    {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                                                </>
                                            )}

                                            {formSubmitted && (
                                                <div className="text-start mt-2">
                                                    <p className="text-success">Your password reset email has been sent.</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="form-group mb-0">
                                            <Link className="btn btn-primary primary-reset btn-block" to="/login">
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

export default ForgotPassword;
