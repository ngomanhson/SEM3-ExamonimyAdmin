import { useEffect, useState } from "react";
import api from "../../services/api";
import url from "../../services/url";
import { format } from "date-fns";
import Layout from "../../layouts/layouts";
import { Helmet } from "react-helmet";
function Course_List() {
    const [courses, setCourses] = useState([]);
    const [courseCodes, setCourseCodes] = useState([]);

    const loadCourses = async () => {
        try {
            const classCourseResponse = await api.get(url.ClassCourse.LIST);
            const classIds = classCourseResponse.data.data.map(
                (item) => item.class_id
            );
            const courseResponse = await api.get(url.COURSE.LIST, {
                params: {
                    classIds: classIds.join(","),
                },
            });
            const fetchedCourseCodes = courseResponse.data.data.reduce(
                (acc, item) => {
                    acc[item.id] = item.course_code;
                    return acc;
                },
                {}
            );
            setCourses(classCourseResponse.data.data);
            setCourseCodes(fetchedCourseCodes);
        } catch (error) {}
    };

    const getCourseCode = (courseId) => {
        return courseCodes[courseId] || "";
    };

    useEffect(() => {
        loadCourses();
    }, []);
    return (
        <>
            <Helmet>
                <title>Course | Examonimy</title>
            </Helmet>
            <Layout>
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col">
                            <h3 className="page-title">Courses List</h3>
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
                                    placeholder="Search by className ..."
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
                                                Courses
                                            </h3>
                                        </div>
                                        <div className="col-auto text-end float-end ms-auto download-grp">
                                            <a
                                                href="#"
                                                className="btn btn-outline-primary me-2"
                                            >
                                                <i className="fas fa-download"></i>{" "}
                                                Download
                                            </a>
                                            <a
                                                href="add-subject.html"
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
                                                <th>Ordinal</th>
                                                <th>
                                                    Name Course and Code Course
                                                </th>
                                                <th>Name Class</th>
                                                <th>Start Date</th>
                                                <th>End Date</th>
                                                <th className="text-end">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {courses.map((item, index) => {
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
                                                        <td>
                                                            {item.courseName} (
                                                            {getCourseCode(
                                                                item.course_id
                                                            )}
                                                            )
                                                        </td>
                                                        <td>
                                                            {item.className}
                                                        </td>
                                                        <td>
                                                            {format(
                                                                new Date(
                                                                    item.startDate
                                                                ),
                                                                "yyyy-MM-dd"
                                                            )}
                                                        </td>
                                                        <td>
                                                            {format(
                                                                new Date(
                                                                    item.endDate
                                                                ),
                                                                "yyyy-MM-dd"
                                                            )}
                                                        </td>
                                                        <td className="text-end">
                                                            <div className="actions">
                                                                <a
                                                                    href="javascript:;"
                                                                    className="btn btn-sm bg-success-light me-2"
                                                                >
                                                                    <i className="feather-eye"></i>
                                                                </a>
                                                                <a
                                                                    href="edit-subject.html"
                                                                    className="btn btn-sm bg-danger-light"
                                                                >
                                                                    <i className="feather-edit"></i>
                                                                </a>
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
export default Course_List;
