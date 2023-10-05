import React from "react";
import "@mobiscroll/react/dist/css/mobiscroll.min.css";
import { Select, Page, setOptions } from "@mobiscroll/react";
import { NavLink } from "react-router-dom";
function Exam_Create() {
    setOptions({
        theme: "ios",
        themeVariant: "light",
    });

    const myData = [
        {
            value: 1,
            text: "Trung",
        },
        {
            value: 2,
            text: "Ha Hoang",
        },
        {
            value: 3,
            text: "Phung Vu",
        },
        {
            value: 4,
            text: "Ngo Manh Son",
        },
        {
            value: 5,
            text: "Duc Hoang",
        },
    ];
    return (
        <>
            <div className="page-header">
                <div className="row">
                    <div className="col">
                        <h3 className="page-title">Create Exam</h3>
                    </div>
                </div>
            </div>

            <div className="row">
                <div class="col-md-9">
                    <ul class="list-links mb-4">
                        <li class="active">
                            <NavLink to="">Multiple choice Test</NavLink>
                        </li>
                        <li>
                            <NavLink to="/exam-create-essay">
                                Essay test
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="row">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title">Exam Information</h5>
                        </div>
                        <div class="card-body">
                            <form action="#">
                                <div className="form-group">
                                    <label>Course </label>
                                    <select className="form-control select">
                                        <option>ASP</option>
                                        <option>React</option>
                                        <option>Laravel</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Exam Title</label>
                                    <input type="text" class="form-control" />
                                </div>
                                <div class="form-group">
                                    <label>Exam start time</label>
                                    <input
                                        class="form-control"
                                        type="datetime-local"
                                    />
                                </div>
                                <div class="form-group">
                                    <label>Exam end time</label>
                                    <input
                                        className="form-control"
                                        type="datetime-local"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>
                                        The class receives exam questions{" "}
                                    </label>
                                    <select className="form-control select">
                                        <option>T2207A</option>
                                        <option>T2207B</option>
                                        <option>T2207C</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <Select
                                        data={myData}
                                        selectMultiple={true}
                                        label="Students receive exams"
                                        inputStyle="outline"
                                        labelStyle="stacked"
                                        placeholder="Please select student ..."
                                    />
                                </div>
                                <div className="text-end">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                    >
                                        Create
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-xl-6">
                    <div className="card bg-white">
                        <div class="card-header">
                            <h5 class="card-title">
                                Exam Question{" "}
                                <button
                                    type="button"
                                    className="btn btn-primary float-sm-end m-l-10"
                                    data-bs-toggle="modal"
                                    data-bs-target="#scrollable-modal"
                                >
                                    Add New Question
                                </button>
                            </h5>
                            <div
                                className="modal fade"
                                id="scrollable-modal"
                                tabindex="-1"
                                role="dialog"
                                aria-labelledby="scrollableModalTitle"
                                aria-hidden="true"
                            >
                                <div
                                    className="modal-dialog modal-dialog-scrollable"
                                    role="document"
                                >
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5
                                                className="modal-title"
                                                id="scrollableModalTitle"
                                            >
                                                Add Question For "Ten bai thi"
                                            </h5>
                                            <button
                                                type="button"
                                                className="btn-close"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                            ></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="form-group">
                                                <label>Question Name</label>
                                                <input
                                                    type="text"
                                                    class="form-control"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <b>Input word for choice's</b>
                                            </div>
                                            <div className="form-group">
                                                <label>Choice A</label>
                                                <input
                                                    type="text"
                                                    class="form-control"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Choice B</label>
                                                <input
                                                    type="text"
                                                    class="form-control"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Choice C</label>
                                                <input
                                                    type="text"
                                                    class="form-control"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Choice D</label>
                                                <input
                                                    type="text"
                                                    class="form-control"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Correct Answer</label>
                                                <input
                                                    type="text"
                                                    class="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                data-bs-dismiss="modal"
                                            >
                                                Close
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                            >
                                                Add Question
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div class="row">
                                <div class="col-md-10">
                                    <h5>Question</h5>
                                </div>
                                <div class="col-md-2">
                                    <h5>Action</h5>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="vertical-scroll scroll-demo">
                                    <div class="row">
                                        <div class="col-md-10">
                                            <div class="invoice-terms">
                                                <h6>
                                                    1 .{" "}
                                                    <span>React la cai gi</span>
                                                </h6>
                                                <p class="mb-1">
                                                    A - <span>Khong biet</span>
                                                </p>
                                                <p class="mb-1 text-primary">
                                                    B -{" "}
                                                    <span>
                                                        React la React{" "}
                                                        <i class="fa fa-check"></i>
                                                    </span>
                                                </p>
                                                <p class="mb-1">
                                                    C - <span>Chiu</span>
                                                </p>
                                                <p class="mb-1">
                                                    D -{" "}
                                                    <span>All dap an tren</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div class="col-md-2">
                                            <button
                                                type="button"
                                                class="btn btn-info btn-sm"
                                            >
                                                Update
                                            </button>
                                            <button
                                                type="button"
                                                class="btn btn-danger btn-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-10">
                                            <div class="invoice-terms">
                                                <h6>
                                                    2 .{" "}
                                                    <span>
                                                        Who are all ________
                                                        people?
                                                    </span>
                                                </h6>
                                                <p class="mb-1">
                                                    A - <span>this</span>
                                                </p>
                                                <p class="mb-1 text-primary">
                                                    B -{" "}
                                                    <span>
                                                        those{" "}
                                                        <i class="fa fa-check"></i>
                                                    </span>
                                                </p>
                                                <p class="mb-1">
                                                    C - <span>them</span>
                                                </p>
                                                <p class="mb-1">
                                                    D - <span>that</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div class="col-md-2">
                                            <button
                                                type="button"
                                                class="btn btn-info btn-sm"
                                            >
                                                Update
                                            </button>
                                            <button
                                                type="button"
                                                class="btn btn-danger btn-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-10">
                                            <div class="invoice-terms">
                                                <h6>
                                                    3 .{" "}
                                                    <span>
                                                        I ____ a car next year.
                                                    </span>
                                                </h6>
                                                <p class="mb-1">
                                                    A - <span>Khong biet</span>
                                                </p>
                                                <p class="mb-1">
                                                    B -{" "}
                                                    <span>React la React</span>
                                                </p>
                                                <p class="mb-1 text-primary">
                                                    C -{" "}
                                                    <span>
                                                        Chiu{" "}
                                                        <i class="fa fa-check"></i>
                                                    </span>
                                                </p>
                                                <p class="mb-1">
                                                    D -{" "}
                                                    <span>All dap an tren</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div class="col-md-2">
                                            <button
                                                type="button"
                                                class="btn btn-info btn-sm"
                                            >
                                                Update
                                            </button>
                                            <button
                                                type="button"
                                                class="btn btn-danger btn-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Exam_Create;
