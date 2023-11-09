import { useEffect, useState } from "react";
import api from "../../services/api";
import url from "../../services/url";
import { NavLink } from "react-router-dom";
import Layout from "../../layouts/layouts";
import { Helmet } from "react-helmet";
function Classes_List() {
    const [classes, setClasses] = useState([]);
    const [teacherNames, setTeacherNames] = useState({});
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [classesPerPage] = useState(10);

    //hiển thị danh sách lớp
    const loadClasses = async () => {
        try {
            const response = await api.get(url.CLASS.LIST);
            setClasses(response.data);
        } catch (error) {
            setError("Failed to load classes.");
        }
    };

    //thông báo
    const showNotification = (type, message) => {
        const notificationContainer = document.getElementById(
            "notification-container"
        );
        const notification = document.createElement("div");
        notification.className = `alert alert-${type}`;
        notification.textContent = message;
        notificationContainer.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    };

    //xử lý xoá lớp học
    const handleDeleteClass = (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this class?"
        );
        if (confirmed) {
            deleteClass(id);
        }
    };

    const deleteClass = async (id) => {
        try {
            await api.delete(`${url.CLASS.DELETE}?id=${id}`);
            setClasses(classes.filter((c) => c.id !== id));
        } catch (error) {
            showNotification(
                "danger",
                "The class cannot be deleted because this class currently has students."
            );
        }
    };

    //hiển thị tên giáo viên
    const fetchTeacherNames = async () => {
        try {
            const response = await api.get(url.STAFF.LIST);
            const teacherNameMap = {};
            response.data.forEach((teacher) => {
                teacherNameMap[teacher.id] = teacher.fullname;
            });
            setTeacherNames(teacherNameMap);
        } catch (error) {
            setError("Failed to fetch teacher names.");
        }
    };

    //paginate
    const indexOfLastClass = currentPage * classesPerPage;
    const indexOfFirstClass = indexOfLastClass - classesPerPage;
    const currentClasses = classes.slice(indexOfFirstClass, indexOfLastClass);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        loadClasses();
        fetchTeacherNames();
    }, []);
    return (
        <>
            <Helmet>
                <title>Class | Examonimy</title>
            </Helmet>
            <Layout>
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col">
                            <h3 className="page-title">Classes List</h3>
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
                                    placeholder="Search by Room ..."
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
                                                Class
                                            </h3>
                                        </div>
                                        <div className="col-auto text-end float-end ms-auto download-grp">
                                            <NavLink
                                                to="/class-create"
                                                className="btn btn-primary"
                                            >
                                                <i className="fas fa-plus"></i>
                                            </NavLink>
                                        </div>
                                    </div>
                                </div>

                                <div id="notification-container"></div>

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
                                            <th>Ordinal</th>
                                            <th>Name</th>
                                            <th>Room</th>
                                            <th>Teacher</th>
                                            <th className="text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentClasses.map((item, index) => {
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
                                                    <td>{index + 1}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.room}</td>
                                                    <td>
                                                        {
                                                            teacherNames[
                                                                item.teacher_id
                                                            ]
                                                        }
                                                    </td>
                                                    <td className="text-end">
                                                        <div className="actions">
                                                            <NavLink
                                                                to={`/student-of-class-list/${item.id}`}
                                                                className="btn btn-sm bg-success-light me-2"
                                                            >
                                                                <i className="feather-eye"></i>
                                                            </NavLink>
                                                            <NavLink
                                                                to={`/classes-edit/${item.slug}`}
                                                                className="btn btn-sm bg-danger-light"
                                                            >
                                                                <i className="feather-edit"></i>
                                                            </NavLink>
                                                            <NavLink
                                                                onClick={() =>
                                                                    handleDeleteClass(
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

                <div className="row">
                    <div className="col">
                        <ul className="pagination mb-4">
                            <li className="page-item">
                                <button
                                    className="page-link"
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                            </li>

                            {Array.from(
                                {
                                    length: Math.ceil(
                                        classes.length / classesPerPage
                                    ),
                                },
                                (_, i) => (
                                    <li
                                        key={i}
                                        className={`page-item ${
                                            i + 1 === currentPage
                                                ? "active"
                                                : ""
                                        }`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() => paginate(i + 1)}
                                        >
                                            {i + 1}
                                        </button>
                                    </li>
                                )
                            )}
                            <li className="page-item">
                                <button
                                    className="page-link"
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={
                                        currentPage ===
                                        Math.ceil(
                                            classes.length / classesPerPage
                                        )
                                    }
                                >
                                    Next
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </Layout>
        </>
    );
}
export default Classes_List;
