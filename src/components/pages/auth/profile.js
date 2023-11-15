import { Helmet } from "react-helmet";
import Layout from "../../layouts/layouts";
import api from "../../services/api";
import url from "../../services/url";
import { useState, useEffect } from "react";
import Change_Password from "./changepassword";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
function Profile() {
    const [info, setInfo] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editedInfo, setEditedInfo] = useState({});
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    const loadProfile = async () => {
        const userToken = localStorage.getItem("accessToken");

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userToken}`,
                },
            };

            const profileResponse = await api.get(url.AUTH.PROFILE, config);
            setInfo(profileResponse.data);
        } catch (error) {}
    };

    const handleEditClick = () => {
        setIsEditing(!isEditing);
        if (!isEditing) {
            setEditedInfo({ ...info });
        }
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        // Reset editedInfo to the original data
        setEditedInfo({});
    };

    const handleSaveClick = async () => {
        try {
            const userToken = localStorage.getItem("accessToken");

            const config = {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            };

            const formData = new FormData();

            // If avatarFile is present, append it to the FormData
            if (avatarFile) {
                formData.append("avatar", avatarFile);
            }

            // Append other fields from editedInfo
            for (const key in editedInfo) {
                formData.append(key, editedInfo[key]);
            }

            // Send the request
            const isConfirmed = await Swal.fire({
                title: "Are you sure?",
                text: "You want to update your information?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "I'm sure",
            });

            if (isConfirmed.isConfirmed) {
                const updateResponse = await api.put(url.AUTH.UPDATE_PROFILE, formData, config);

                if (updateResponse.status === 204) {
                    toast.success("Successfully updated.", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 3000,
                    });
                } else {
                    toast.error("Error! An error occurred. Please try again later", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 3000,
                    });
                }
            }

            // Update the local state with edited information
            setInfo(editedInfo);
            setIsEditing(false);
        } catch (error) {
            toast.error("Error! An error occurred. Please try again later.", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
        }
    };

    const allowedExtensions = ["png", "jpg", "jpeg", "heic"];

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const fileExtension = file.name.split(".").pop().toLowerCase();

            if (!allowedExtensions.includes(fileExtension)) {
                toast.error("Only .png, .jpg, .jpeg, and .heic files are allowed.", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
                // You can also reset the input field if needed
                e.target.value = "";
                return;
            }

            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);
    return (
        <>
            <Helmet>
                <title>Profile | Examonimy</title>
            </Helmet>
            <Layout>
                <div className="row">
                    <div className="col-md-12">
                        {Object.keys(info).length > 0 ? (
                            <>
                                <div className="profile-header">
                                    <div className="row align-items-center">
                                        <div className="col-auto">
                                            <div className="student-avatar">
                                                <label htmlFor="avatarInput">
                                                    {isEditing ? (
                                                        avatarPreview ? (
                                                            <div className="avatar-inner">
                                                                <img src={avatarPreview} alt="Avatar Preview" className="avatar-preview" />
                                                                <img src="./assets/img/default-placeholder.png" alt="" className="img-default" />
                                                            </div>
                                                        ) : (
                                                            <div className="avatar-inner">
                                                                <img src={info.avatar} alt={info.fullname} className="avatar-preview" />
                                                                <img src="./assets/img/default-placeholder.png" alt="" className="img-default" />
                                                            </div>
                                                        )
                                                    ) : (
                                                        <img src={info.avatar} alt={info.fullname} className="avatar-preview" />
                                                    )}
                                                </label>
                                                {isEditing && <input id="avatarInput" type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />}
                                            </div>
                                        </div>
                                        <div className="col ms-md-n2 profile-user-info">
                                            <h4 className="user-name mb-0">{info.fullname}</h4>
                                            <h6 className="text-muted">Teacher</h6>
                                            <div className="user-Location">
                                                <i className="fas fa-map-marker-alt"></i> {info.address}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="profile-menu">
                                    <ul className="nav nav-tabs nav-tabs-solid">
                                        <li className="nav-item">
                                            <a className="nav-link active" data-bs-toggle="tab" href="#per_details_tab">
                                                Information
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" data-bs-toggle="tab" href="#password_tab">
                                                Change Password
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="tab-content profile-tab-cont">
                                    <div className="tab-pane fade show active" id="per_details_tab">
                                        <div className="row">
                                            <div className="col-lg-9">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <h5 className="card-title d-flex justify-content-between">
                                                            <span>Personal Details</span>
                                                            {isEditing ? (
                                                                <div>
                                                                    <button className="btn btn-light" onClick={handleCancelClick}>
                                                                        Cancel
                                                                    </button>
                                                                    <button className="btn btn-primary" onClick={handleSaveClick}>
                                                                        Save Changes
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <a className="edit-link" onClick={handleEditClick}>
                                                                    <i className="far fa-edit me-1"></i>
                                                                    Edit
                                                                </a>
                                                            )}
                                                        </h5>

                                                        <div className="row">
                                                            <p className="col-sm-3 text-muted text-sm-end mb-0 mb-sm-3">Name</p>
                                                            <p className="col-sm-9">{info.fullname}</p>
                                                        </div>
                                                        <div className="row">
                                                            <p className="col-sm-3 text-muted text-sm-end mb-0 mb-sm-3">Email ID</p>

                                                            <p className="col-sm-9">{info.email}</p>
                                                        </div>
                                                        <div className="row">
                                                            <p className="col-sm-3 text-muted text-sm-end mb-0 mb-sm-3">Date of Birth</p>
                                                            {isEditing ? (
                                                                <input
                                                                    type="date"
                                                                    className="input-change"
                                                                    value={format(new Date(editedInfo.birthday), "yyyy-MM-dd") || ""}
                                                                    onChange={(e) => setEditedInfo({ ...editedInfo, birthday: e.target.value })}
                                                                />
                                                            ) : (
                                                                <p class="col-sm-9">{format(new Date(info.birthday), "dd/MM/yyyy")}</p>
                                                            )}
                                                        </div>
                                                        <div className="row">
                                                            <p className="col-sm-3 text-muted text-sm-end mb-0 mb-sm-3">Gender</p>
                                                            {isEditing ? (
                                                                <select
                                                                    className="input-change"
                                                                    value={editedInfo.gender || ""}
                                                                    onChange={(e) => setEditedInfo({ ...editedInfo, gender: e.target.value })}
                                                                >
                                                                    <option value="Male">Male</option>
                                                                    <option value="Female">Female</option>
                                                                </select>
                                                            ) : (
                                                                <p className="col-sm-9">{info.gender}</p>
                                                            )}
                                                        </div>
                                                        <div className="row">
                                                            <p className="col-sm-3 text-muted text-sm-end mb-0 mb-sm-3">Mobile</p>
                                                            {isEditing ? (
                                                                <input
                                                                    type="tel"
                                                                    className="input-change"
                                                                    value={editedInfo.phone || ""}
                                                                    onChange={(e) => setEditedInfo({ ...editedInfo, phone: e.target.value })}
                                                                />
                                                            ) : (
                                                                <p className="col-sm-9">{info.phone}</p>
                                                            )}
                                                        </div>
                                                        <div className="row">
                                                            <p className="col-sm-3 text-muted text-sm-end mb-0">Address</p>
                                                            {isEditing ? (
                                                                <input
                                                                    type="datetime"
                                                                    className="input-change"
                                                                    value={editedInfo.address || ""}
                                                                    onChange={(e) => setEditedInfo({ ...editedInfo, address: e.target.value })}
                                                                />
                                                            ) : (
                                                                <p className="col-sm-9 mb-0">{info.address}</p>
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
                                                        <button className="btn btn-success" type="button">
                                                            <i className="fe fe-check-verified"></i> Active
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
                            </>
                        ) : (
                            <p>Loading profile data...</p>
                        )}
                    </div>
                </div>
            </Layout>
        </>
    );
}
export default Profile;
