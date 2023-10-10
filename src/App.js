import { Route, Routes } from "react-router-dom";
import Header from "./components/layouts/header";
import Sidebar from "./components/layouts/sidebar";
import Admin_Dashboard from "./components/pages/dashboard/admin-dashboard";
import Teacher_Dashboard from "./components/pages/dashboard/teacher-dashboard";
import Student_List from "./components/pages/student/student-list";
import Student_Create from "./components/pages/student/student-create";
import Teacher_List from "./components/pages/teacher/teacher-list";
import Teacher_Create from "./components/pages/teacher/teacher-create";
import Exam_Create from "./components/pages/exam/exam-create";
import Exam_Create_Essay from "./components/pages/exam/exam-create-essay";
import Exam_List from "./components/pages/exam/exam-list";
import Course_List from "./components/pages/course/course-list";
import Course_Create from "./components/pages/course/course-create";
import Classes_List from "./components/pages/classes/classes-list";
import Classes_Create from "./components/pages/classes/classes-create";
import Blog_List from "./components/pages/blog/blog-list";
import Blog_Create from "./components/pages/blog/blog-create";
import Classes_Edit from "./components/pages/classes/classes-edit";
import Student_Edit from "./components/pages/student/student-edit";
import Student_Of_Class_List from "./components/pages/classes/student-of-class-list";

function App() {
    return (
        <div className="App">
            <div className="main-wrapper">
                <Header></Header>
                <Sidebar></Sidebar>
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <Routes>
                            {/* start route dashboard */}
                            <Route
                                path="/"
                                element={<Admin_Dashboard />}
                            ></Route>
                            <Route
                                path="/teacher-dashboard"
                                element={<Teacher_Dashboard />}
                            ></Route>
                            {/* end route dashboard */}

                            {/* star route exam */}
                            <Route
                                path="/exam-list"
                                element={<Exam_List />}
                            ></Route>
                            <Route
                                path="/exam-create"
                                element={<Exam_Create />}
                            ></Route>
                            <Route
                                path="/exam-create-essay"
                                element={<Exam_Create_Essay />}
                            ></Route>
                            {/* end route exam */}

                            {/* start route classes */}
                            <Route
                                path="/classes-list"
                                element={<Classes_List />}
                            ></Route>
                            <Route
                                path="/class-create"
                                element={<Classes_Create />}
                            ></Route>
                            <Route
                                path="/classes-edit/:slug"
                                element={<Classes_Edit />}
                            ></Route>
                            <Route
                                path="/student-of-class-list/:id"
                                element={<Student_Of_Class_List />}
                            ></Route>
                            {/* end route course */}

                            {/* start route course */}
                            <Route
                                path="/course-list"
                                element={<Course_List />}
                            ></Route>
                            <Route
                                path="/course-create"
                                element={<Course_Create />}
                            ></Route>
                            {/* end route course */}

                            {/* start route teacher */}
                            <Route
                                path="/teacher-list"
                                element={<Teacher_List />}
                            ></Route>
                            <Route
                                path="/teacher-create"
                                element={<Teacher_Create />}
                            ></Route>
                            {/* end route teacher */}

                            {/* start route student */}
                            <Route
                                path="/student-list"
                                element={<Student_List />}
                            ></Route>
                            <Route
                                path="/student-create"
                                element={<Student_Create />}
                            ></Route>
                            <Route
                                path="/student-edit/:id"
                                element={<Student_Edit />}
                            ></Route>
                            {/* end route student */}

                            {/* start route blog */}
                            <Route
                                path="/blog-list"
                                element={<Blog_List />}
                            ></Route>
                            <Route
                                path="/blog-create"
                                element={<Blog_Create />}
                            ></Route>
                            {/* end route blog */}
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
