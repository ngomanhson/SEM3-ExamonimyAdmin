import { Helmet } from "react-helmet";
import Layout from "../../layouts/layouts";
import api from "../../services/api";
import url from "../../services/url";
import { useState, useEffect } from "react";
import Change_Password from "./changepassword";
import { format } from "date-fns";
import { useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Profile() {
    const [profile, setProfile] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef(null);
    const formattedBirthday = profile.birthday
        ? format(new Date(profile.birthday), "dd-MM-yyyy")
        : "";

    // Load profile information
    const loadedProfile = async () => {
        const adminToken = localStorage.getItem("accessToken");
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminToken}`,
                },
            };
            const response = await api.get(url.AUTH.PROFILE, config);
            setProfile((prevProfile) => ({
                ...prevProfile,
                ...response.data,
            }));
        } catch (error) {
            console.error("Error loading profile:", error);
        }
    };

    useEffect(() => {
        loadedProfile();
    }, []);

    // Toggle editing mode
    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    // Cancel editing
    const handleCancelClick = () => {
        setIsEditing(false);
    };

    // Update profile information
    const updateProfile = async () => {
        const adminToken = localStorage.getItem("accessToken");

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminToken}`,
                },
            };

            // Update the state first
            setProfile((prevProfile) => ({
                ...prevProfile,
            }));

            // Then make the API call
            await api.put(url.AUTH.UPDATE_PROFILE, profile, config);

            // After the API call is successful, you can perform additional actions if needed
            setIsEditing(false);
            toast.success("Update profile Successfully", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    useEffect(() => {
        if (isEditing) {
            inputRef.current.focus();
        }
    }, [isEditing]);
    return (
        <>
            <Helmet>
                <title>Profile | Examonimy</title>
            </Helmet>
            <Layout>
                <div className="row">
                    <div className="col-md-12">
                        <div className="profile-header">
                            <div className="row align-items-center">
                                <div className="col-auto profile-image">
                                    <a href="#">
                                        <img
                                            className="rounded-circle"
                                            alt="User Image"
                                            src={profile.avatar}
                                        />
                                    </a>
                                </div>
                                <div className="col ms-md-n2 profile-user-info">
                                    <h4 className="user-name mb-0">
                                        {profile.fullname}
                                    </h4>
                                    <h6 className="text-muted">Teacher</h6>
                                    <div className="user-Location">
                                        <i className="fas fa-map-marker-alt"></i>{" "}
                                        {profile.address}
                                    </div>
                                </div>
                                <div className="col-auto profile-btn">
                                    <img
                                        src="assets/img/logo.png"
                                        alt
                                        height="42"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="profile-menu">
                            <ul className="nav nav-tabs nav-tabs-solid">
                                <li className="nav-item">
                                    <a
                                        className="nav-link active"
                                        data-bs-toggle="tab"
                                        href="#per_details_tab"
                                    >
                                        Information
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        className="nav-link"
                                        data-bs-toggle="tab"
                                        href="#password_tab"
                                    >
                                        Change Password
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="tab-content profile-tab-cont">
                            <div
                                className="tab-pane fade show active"
                                id="per_details_tab"
                            >
                                <div className="row">
                                    <div className="col-lg-9">
                                        <div className="card">
                                            <div className="card-body">
                                                <h5 className="card-title d-flex justify-content-between">
                                                    <span>
                                                        Personal Details
                                                    </span>
                                                    {isEditing ? (
                                                        <div>
                                                            <button
                                                                className="btn btn-light"
                                                                onClick={
                                                                    handleCancelClick
                                                                }
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                className="btn btn-primary"
                                                                onClick={
                                                                    updateProfile
                                                                }
                                                            >
                                                                Save Changes
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <a
                                                            className="edit-link"
                                                            onClick={toggleEdit}
                                                        >
                                                            <i className="far fa-edit me-1"></i>
                                                            Edit
                                                        </a>
                                                    )}
                                                </h5>

                                                <div className="row">
                                                    <p className="col-sm-3 text-muted text-sm-end mb-0 mb-sm-3">
                                                        Name
                                                    </p>
                                                    <p className="col-sm-9">
                                                        {profile.fullname}
                                                    </p>
                                                </div>
                                                <div className="row">
                                                    <p className="col-sm-3 text-muted text-sm-end mb-0 mb-sm-3">
                                                        Email ID
                                                    </p>
                                                    {isEditing ? (
                                                        <input
                                                            type="email"
                                                            value={
                                                                profile.email
                                                            }
                                                            onChange={(e) =>
                                                                setProfile({
                                                                    ...profile,
                                                                    email: e
                                                                        .target
                                                                        .value,
                                                                })
                                                            }
                                                            className="input-change"
                                                            ref={inputRef}
                                                        />
                                                    ) : (
                                                        <p className="col-sm-9">
                                                            {profile.email}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="row">
                                                    <p className="col-sm-3 text-muted text-sm-end mb-0 mb-sm-3">
                                                        Date of Birth
                                                    </p>
                                                    {isEditing ? (
                                                        <input
                                                            type="date"
                                                            value={
                                                                format(
                                                                    new Date(
                                                                        profile.birthday
                                                                    ),
                                                                    "yyyy-MM-dd"
                                                                ) || ""
                                                            }
                                                            onChange={(e) =>
                                                                setProfile({
                                                                    ...profile,
                                                                    birthday:
                                                                        e.target
                                                                            .value,
                                                                })
                                                            }
                                                            className="input-change"
                                                        />
                                                    ) : (
                                                        <p className="col-sm-9">
                                                            {formattedBirthday}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="row">
                                                    <p className="col-sm-3 text-muted text-sm-end mb-0 mb-sm-3">
                                                        Gender
                                                    </p>
                                                    {isEditing ? (
                                                        <select
                                                            className="input-change"
                                                            value={
                                                                profile.gender ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                setProfile({
                                                                    ...profile,
                                                                    gender: e
                                                                        .target
                                                                        .value,
                                                                })
                                                            }
                                                        >
                                                            <option value="Male">
                                                                Male
                                                            </option>
                                                            <option value="Female">
                                                                Female
                                                            </option>
                                                        </select>
                                                    ) : (
                                                        <p className="col-sm-9">
                                                            {profile.gender}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="row">
                                                    <p className="col-sm-3 text-muted text-sm-end mb-0 mb-sm-3">
                                                        Mobile
                                                    </p>
                                                    {isEditing ? (
                                                        <input
                                                            type="datetime"
                                                            value={
                                                                profile.phone
                                                            }
                                                            onChange={(e) =>
                                                                setProfile({
                                                                    ...profile,
                                                                    phone: e
                                                                        .target
                                                                        .value,
                                                                })
                                                            }
                                                            className="input-change"
                                                        />
                                                    ) : (
                                                        <p className="col-sm-9">
                                                            {profile.phone}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="row">
                                                    <p className="col-sm-3 text-muted text-sm-end mb-0">
                                                        Address
                                                    </p>
                                                    {isEditing ? (
                                                        <input
                                                            type="datetime"
                                                            value={
                                                                profile.address
                                                            }
                                                            onChange={(e) =>
                                                                setProfile({
                                                                    ...profile,
                                                                    address:
                                                                        e.target
                                                                            .value,
                                                                })
                                                            }
                                                            className="input-change"
                                                        />
                                                    ) : (
                                                        <p className="col-sm-9 mb-0">
                                                            {profile.address}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="card">
                                            <div className="card-body">
                                                <h5 className="card-title d-flex justify-content-between">
                                                    <span>Account Status</span>
                                                </h5>
                                                <button
                                                    className="btn btn-success"
                                                    type="button"
                                                >
                                                    <i className="fe fe-check-verified"></i>{" "}
                                                    Active
                                                </button>
                                            </div>
                                        </div>

                                        <div className="card">
                                            <div className="card-body">
                                                <h5 className="card-title d-flex justify-content-between">
                                                    <span>Teacher </span>
                                                </h5>
                                                <div className="skill-tags">
                                                    <span>Test List</span>
                                                    <span>Class List</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="password_tab" className="tab-pane fade">
                                <Change_Password />
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </Layout>
        </>
    );
}
export default Profile;
