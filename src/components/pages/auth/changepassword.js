import api from "../../services/api";
import url from "../../services/url";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Change_Password() {
    const [incorrectPassword, setIncorrectPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [formErrors, setFormErrors] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    //hiển thị mật khẩu
    const handleTogglePassword = (fieldName) => {
        switch (fieldName) {
            case "currentPassword":
                setShowCurrentPassword(!showCurrentPassword);
                break;
            case "newPassword":
                setShowNewPassword(!showNewPassword);
                break;
            case "confirmPassword":
                setShowConfirmPassword(!showConfirmPassword);
                break;
            default:
                break;
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setFormErrors({ ...formErrors, [name]: "" });
    };
    const validateForm = () => {
        let valid = true;
        const newErrors = {};

        if (!formData.currentPassword) {
            newErrors.currentPassword = "Please enter your password.";
            valid = false;
        } else if (formData.currentPassword.length < 6) {
            newErrors.currentPassword =
                "Password must be at least 6 characters.";
            valid = false;
        } else if (formData.currentPassword.length > 50) {
            newErrors.currentPassword =
                "Password must be less than 50 characters.";
            valid = false;
        }

        if (!formData.newPassword) {
            newErrors.newPassword = "Please enter a new password.";
            valid = false;
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword =
                "New password must be at least 6 characters.";
            valid = false;
        } else if (formData.newPassword.length > 50) {
            newErrors.newPassword =
                "New password must be less than 50 characters.";
            valid = false;
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password.";
            valid = false;
        } else if (formData.confirmPassword !== formData.newPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
            valid = false;
        }

        setFormErrors(newErrors);
        return valid;
    };
    //xử lý đổi mật khẩu
    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            const userToken = localStorage.getItem("accessToken");

            if (userToken) {
                try {
                    const config = {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${userToken}`,
                        },
                    };

                    const requestData = {
                        currentPassword: formData.currentPassword,
                        newPassword: formData.newPassword,
                        confirmPassword: formData.confirmPassword,
                    };

                    const passwordResponse = await api.post(
                        url.AUTH.CHANGE_PASSWORD,
                        requestData,
                        config
                    );

                    if (passwordResponse.data.success) {
                        localStorage.removeItem("accessToken");
                        setTimeout(() => {
                            navigate("/login");
                        }, 3000);

                        toast.success(
                            "Password changed successfully. Please login again!",
                            {
                                position: toast.POSITION.TOP_RIGHT,
                                autoClose: 2000,
                            }
                        );
                    }
                } catch (error) {
                    if (error.response && error.response.status === 400) {
                        // Mật khẩu cũ không đúng
                        setIncorrectPassword(true);
                    } else {
                        toast.error(
                            "An error occurred while changing the password.",
                            {
                                position: toast.POSITION.TOP_RIGHT,
                                autoClose: 5000,
                            }
                        );
                    }
                }
            } else {
                toast.error("User is not authenticated. Please log in again.", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 5000,
                });
            }
        }
    };

    return (
        <>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Change Password</h5>
                    <div className="row">
                        <div className="col-md-10 col-lg-6">
                            <form onSubmit={handleChangePassword}>
                                <div
                                    className={`form-group ${
                                        formErrors.email ? "is-invalid" : ""
                                    }`}
                                >
                                    <div className="form-group">
                                        <label>Old Password</label>
                                        <input
                                            type={
                                                showCurrentPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="currentPassword"
                                            id="currentPassword"
                                            className={`form-control ${
                                                formErrors.currentPassword ||
                                                incorrectPassword
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            value={formData.currentPassword}
                                            onChange={handleChange}
                                        />
                                        {formErrors.currentPassword && (
                                            <div className="invalid-feedback">
                                                {formErrors.currentPassword}
                                            </div>
                                        )}
                                        {incorrectPassword && (
                                            <div className="invalid-feedback">
                                                Incorrect old password.
                                            </div>
                                        )}
                                        {!formErrors.currentPassword &&
                                            !incorrectPassword && (
                                                <div className="input-group-append">
                                                    <span
                                                        className={`show-pass ${
                                                            showCurrentPassword
                                                                ? "active"
                                                                : ""
                                                        }`}
                                                        onClick={() =>
                                                            handleTogglePassword(
                                                                "currentPassword"
                                                            )
                                                        }
                                                    >
                                                        {showCurrentPassword ? (
                                                            <i className="fa fa-eye-slash"></i>
                                                        ) : (
                                                            <i className="fa fa-eye"></i>
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                    </div>
                                </div>
                                <div
                                    className={`form-group form-group-2${
                                        formErrors.newPassword
                                            ? " is-invalid"
                                            : ""
                                    }`}
                                >
                                    <div className="form-group">
                                        <label>New Password</label>
                                        <input
                                            type={
                                                showNewPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="newPassword"
                                            id="newPassword"
                                            className={`form-control ${
                                                formErrors.newPassword
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                        />
                                        {formErrors.newPassword && (
                                            <div className="invalid-feedback">
                                                {formErrors.newPassword}
                                            </div>
                                        )}
                                        {!formErrors.newPassword && (
                                            <div className="input-group-append">
                                                <span
                                                    className="show-pass"
                                                    onClick={() =>
                                                        handleTogglePassword(
                                                            "newPassword"
                                                        )
                                                    }
                                                >
                                                    {showNewPassword ? (
                                                        <i className="fa fa-eye-slash"></i>
                                                    ) : (
                                                        <i className="fa fa-eye"></i>
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div
                                    className={`form-group form-group-2${
                                        formErrors.confirmPassword
                                            ? " is-invalid"
                                            : ""
                                    }`}
                                >
                                    <div className="form-group">
                                        <label>Confirm Password</label>
                                        <input
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="confirmPassword"
                                            id="confirmPassword"
                                            className={`form-control ${
                                                formErrors.confirmPassword
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                        {formErrors.confirmPassword && (
                                            <div className="invalid-feedback">
                                                {formErrors.confirmPassword}
                                            </div>
                                        )}
                                        {!formErrors.confirmPassword && (
                                            <div className="input-group-append">
                                                <span
                                                    className="show-pass"
                                                    onClick={() =>
                                                        handleTogglePassword(
                                                            "confirmPassword"
                                                        )
                                                    }
                                                >
                                                    {showConfirmPassword ? (
                                                        <i className="fa fa-eye-slash"></i>
                                                    ) : (
                                                        <i className="fa fa-eye"></i>
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <button
                                    className="btn btn-primary"
                                    type="submit"
                                >
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
}
export default Change_Password;
