function Course_List() {
    return (
        <>
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
                                        <h3 className="page-title">Courses</h3>
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
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>className</th>
                                            <th className="text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
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
                                            <td>PRE2209</td>
                                            <td>
                                                <h2>
                                                    <a>Mathematics</a>
                                                </h2>
                                            </td>
                                            <td>5</td>
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
                                            <td>PRE2213</td>
                                            <td>
                                                <h2>
                                                    <a>History</a>
                                                </h2>
                                            </td>
                                            <td>6</td>
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
                                            <td>PRE2143</td>
                                            <td>
                                                <h2>
                                                    <a>Science</a>
                                                </h2>
                                            </td>
                                            <td>3</td>
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
                                            <td>PRE2431</td>
                                            <td>
                                                <h2>
                                                    <a>Geography</a>
                                                </h2>
                                            </td>
                                            <td>8</td>
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
                                            <td>PRE1534</td>
                                            <td>
                                                <h2>
                                                    <a>Botony</a>
                                                </h2>
                                            </td>
                                            <td>9</td>
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
                                            <td>PRE2153</td>
                                            <td>
                                                <h2>
                                                    <a>English</a>
                                                </h2>
                                            </td>
                                            <td>4</td>
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
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Course_List;
