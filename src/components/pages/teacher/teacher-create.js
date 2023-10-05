function Teacher_Create() {
    return (
        <>
            <div className="page-header">
                <div className="row align-items-center">
                    <div className="col">
                        <h3 className="page-title">Add Teachers</h3>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="teachers.html">Teachers</a>
                            </li>
                            <li className="breadcrumb-item active">
                                Add Teachers
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-sm-12">
                    <div className="card">
                        <div className="card-body">
                            <form>
                                <div className="row">
                                    <div className="col-12">
                                        <h5 className="form-title">
                                            <span>Basic Details</span>
                                        </h5>
                                    </div>
                                    <div className="col-12 col-sm-4">
                                        <div className="form-group local-forms">
                                            <label>
                                                Teacher ID{" "}
                                                <span className="login-danger">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Teacher ID"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-4">
                                        <div className="form-group local-forms">
                                            <label>
                                                Name{" "}
                                                <span className="login-danger">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Name"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-4">
                                        <div className="form-group local-forms">
                                            <label>
                                                Gender{" "}
                                                <span className="login-danger">
                                                    *
                                                </span>
                                            </label>
                                            <select className="form-control select">
                                                <option>Male</option>
                                                <option>Female</option>
                                                <option>Others</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-4">
                                        <div className="form-group local-forms calendar-icon">
                                            <label>
                                                Date Of Birth{" "}
                                                <span className="login-danger">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                className="form-control datetimepicker"
                                                type="text"
                                                placeholder="DD-MM-YYYY"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-4">
                                        <div className="form-group local-forms">
                                            <label>
                                                Mobile{" "}
                                                <span className="login-danger">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Phone"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-4">
                                        <div className="form-group local-forms calendar-icon">
                                            <label>
                                                Joining Date{" "}
                                                <span className="login-danger">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                className="form-control datetimepicker"
                                                type="text"
                                                placeholder="DD-MM-YYYY"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-4 local-forms">
                                        <div className="form-group">
                                            <label>
                                                Qualification{" "}
                                                <span className="login-danger">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                placeholder="Enter Joining Date"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-4">
                                        <div className="form-group local-forms">
                                            <label>
                                                Experience{" "}
                                                <span className="login-danger">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                placeholder="Enter Experience"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <h5 className="form-title">
                                            <span>Login Details</span>
                                        </h5>
                                    </div>
                                    <div className="col-12 col-sm-4">
                                        <div className="form-group local-forms">
                                            <label>
                                                Username{" "}
                                                <span className="login-danger">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Username"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-4">
                                        <div className="form-group local-forms">
                                            <label>
                                                Email ID{" "}
                                                <span className="login-danger">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                placeholder="Enter Mail Id"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-4">
                                        <div className="form-group local-forms">
                                            <label>
                                                Password{" "}
                                                <span className="login-danger">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Password"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-4">
                                        <div className="form-group local-forms">
                                            <label>
                                                Repeat Password{" "}
                                                <span className="login-danger">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Repeat Password"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <h5 className="form-title">
                                            <span>Address</span>
                                        </h5>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-group local-forms">
                                            <label>
                                                Address{" "}
                                                <span className="login-danger">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter address"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-4">
                                        <div className="form-group local-forms">
                                            <label>
                                                City{" "}
                                                <span className="login-danger">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter City"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-4">
                                        <div className="form-group local-forms">
                                            <label>
                                                State{" "}
                                                <span className="login-danger">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter State"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-4">
                                        <div className="form-group local-forms">
                                            <label>
                                                Zip Code{" "}
                                                <span className="login-danger">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Zip"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-4">
                                        <div className="form-group local-forms">
                                            <label>
                                                Country{" "}
                                                <span className="login-danger">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Country"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="student-submit">
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Teacher_Create;
