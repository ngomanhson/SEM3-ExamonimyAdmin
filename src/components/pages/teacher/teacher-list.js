import { useEffect, useState } from "react";
import api from "../../services/api";
import url from "../../services/url";
import { format } from "date-fns";
import { NavLink } from "react-router-dom";
import Layout from "../../layouts/layouts";
import { Helmet } from "react-helmet";
function Teacher_List() {
    const [teacher, setTeacher] = useState([]);
    const [error, setError] = useState(null);
    // hiển thị danh sách giáo viên
    const loadTeacher = async () => {
        try {
            const response = await api.get(url.STAFF.LIST);
            setTeacher(response.data);
        } catch (error) {
            setError("Failed to load teacher.");
        }
    };
    //XỬ lý xóa teacher
    const handleDeleteTeacher = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete ?");
        if (confirm) {
            try {
                await api.delete(`${url.STAFF.DELETE}?id=${id}`);
                setTeacher((prevTeacher) =>
                    prevTeacher.filter((teacher) => teacher.id !== id)
                );
            } catch (error) {
                console.error("Failed to delete teacher:", error);
            }
        }
    };
    useEffect(() => {
        loadTeacher();
    }, []);
    return (
        <>
            <Helmet>
                <title>Teacher | Examonimy</title>
            </Helmet>
            <Layout>
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col">
                            <h3 className="page-title">Teachers</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="index.html">Dashboard</a>
                                </li>
                                <li className="breadcrumb-item active">
                                    Teachers
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="student-group-form">
                    <div className="row">
                        <div className="col-lg-3 col-md-6">
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by ID ..."
                                />
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by Name ..."
                                />
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by Phone ..."
                                />
                            </div>
                        </div>
                        <div className="col-lg-2">
                            <div className="search-student-btn">
                                <button type="btn" className="btn btn-primary">
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card card-table">
                            <div className="card-body">
                                <div className="page-header">
                                    <div className="row align-items-center">
                                        <div className="col">
                                            <h3 className="page-title">
                                                Teachers
                                            </h3>
                                        </div>
                                        <div className="col-auto text-end float-end ms-auto download-grp">
                                            <a
                                                href="teachers.html"
                                                className="btn btn-outline-gray me-2 active"
                                            >
                                                <i className="feather-list"></i>
                                            </a>
                                            <a
                                                href="teachers-grid.html"
                                                className="btn btn-outline-gray me-2"
                                            >
                                                <i className="feather-grid"></i>
                                            </a>
                                            <a
                                                href="#"
                                                className="btn btn-outline-primary me-2"
                                            >
                                                <i className="fas fa-download"></i>
                                                Download
                                            </a>
                                            <a
                                                href="add-teacher.html"
                                                className="btn btn-primary"
                                            >
                                                <i className="fas fa-plus"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="table-responsive">
                                    <table className="table border-0 star-student table-hover table-center mb-0 datatable table-striped">
                                        <thead className="student-thread">
                                            <tr>
                                                <th>
                                                    <div className="form-check check-tables">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            value="something"
                                                        />
                                                    </div>
                                                </th>
                                                <th>Teacher Code</th>
                                                <th>Full Name</th>
                                                <th>Birth Day</th>
                                                <th>Email</th>
                                                <th>Phone Number</th>
                                                <th>Gender</th>
                                                <th>Address</th>
                                                <th className="text-end">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {teacher.map((item, index) => {
                                                return (
                                                    <tr>
                                                        <td>
                                                            <div className="form-check check-tables">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    value="something"
                                                                />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {item.staff_code}
                                                        </td>
                                                        <td>
                                                            <h2 className="table-avatar">
                                                                <a
                                                                    href="student-details.html"
                                                                    className="avatar avatar-sm me-2"
                                                                >
                                                                    <img
                                                                        className="avatar-img rounded-circle"
                                                                        src={
                                                                            item.avatar
                                                                        }
                                                                        alt="User Image"
                                                                    />
                                                                </a>
                                                                <a href="student-details.html">
                                                                    {
                                                                        item.fullname
                                                                    }
                                                                </a>
                                                            </h2>
                                                        </td>
                                                        <td>
                                                            {format(
                                                                new Date(
                                                                    item.birthday
                                                                ),
                                                                "yyyy-MM-dd"
                                                            )}
                                                        </td>
                                                        <td>{item.email}</td>
                                                        <td>{item.phone}</td>
                                                        <td>{item.gender}</td>
                                                        <td>{item.address}</td>

                                                        <td className="text-end">
                                                            <div className="actions">
                                                                <a
                                                                    href="javascript:;"
                                                                    className="btn btn-sm bg-success-light me-2"
                                                                >
                                                                    <i className="feather-eye"></i>
                                                                </a>
                                                                <NavLink
                                                                    to={`/teacher-edit/${item.id}`}
                                                                    className="btn btn-sm bg-danger-light"
                                                                >
                                                                    <i className="feather-edit"></i>
                                                                </NavLink>
                                                                <NavLink
                                                                    onClick={() =>
                                                                        handleDeleteTeacher(
                                                                            item.id
                                                                        )
                                                                    }
                                                                    className="btn btn-sm bg-danger-light"
                                                                >
                                                                    <i className="feather-trash"></i>
                                                                </NavLink>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}
export default Teacher_List;
