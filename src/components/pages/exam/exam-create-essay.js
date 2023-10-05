import React from "react";
import "@mobiscroll/react/dist/css/mobiscroll.min.css";
import { Select, Page, setOptions } from "@mobiscroll/react";
import { NavLink } from "react-router-dom";
function Exam_Create_Essay() {
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
                        <li>
                            <NavLink to="/exam-create">
                                Multiple choice Test
                            </NavLink>
                        </li>
                        <li class="active">
                            <NavLink to="">Essay test</NavLink>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="row">
                <div class="col-md-12">
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
            </div>
        </>
    );
}
export default Exam_Create_Essay;
