import { Navigate, Route, Routes } from "react-router-dom";
import Admin_Dashboard from "./components/pages/dashboard/admin-dashboard";
import Teacher_Dashboard from "./components/pages/dashboard/teacher-dashboard";
import Student_List from "./components/pages/student/student-list";
import Student_Create from "./components/pages/student/student-create";
import Teacher_List from "./components/pages/teacher/teacher-list";
import Teacher_Create from "./components/pages/teacher/teacher-create";
import Exam_Create from "./components/pages/exam/exam-create";
import Exam_List from "./components/pages/exam/exam-list";
import Course_List from "./components/pages/course/course-list";
import Course_Create from "./components/pages/course/course-create";
import Classes_List from "./components/pages/classes/classes-list";
import Classes_Create from "./components/pages/classes/classes-create";
import Blog_List from "./components/pages/blog/blog-list";
import Blog_Create from "./components/pages/blog/blog-create";
import Classes_Edit from "./components/pages/classes/classes-edit";
import Student_Edit from "./components/pages/student/student-edit";
import Student_DeleteAt from "./components/pages/student/student-deleteAt";
import Student_Of_Class_List from "./components/pages/classes/student-of-class-list";
import Exam_Edit from "./components/pages/exam/exam-edit";
import Test_Of_Exam_List from "./components/pages/exam/test/test-of-exam-list";
import Test_Create from "./components/pages/exam/test/test-create";
import Test_Avaliable from "./components/pages/exam/test/test-available";
import Test_List from "./components/pages/exam/test/test-list";
import Test_Essay_Create from "./components/pages/exam/test/test-essay-create";
import Test_Excel_Create from "./components/pages/exam/test/test-excel-create";
import Test_Edit from "./components/pages/exam/test/test-edit";
import Course_Class_Create from "./components/pages/course/course-class-create";
import Login from "./components/pages/auth/login";
import { useJwt } from "react-jwt";
import Profile from "./components/pages/auth/profile";
import ForgotPassword from "./components/pages/auth/forgot-password";
import ResetPassword from "./components/pages/auth/reset-password";
function App() {
    const ProtectedRoute = ({ element }) => {
        const token = localStorage.getItem("accessToken");
        const { isExpired, isInvalid } = useJwt(token);

        if (!token || isExpired || isInvalid) {
            localStorage.removeItem("accessToken");
            return <Navigate to="/login" />;
        }

        return element;
    };

    const ProtectedLoginRoute = ({ element }) => {
        const token = localStorage.getItem("accessToken");
        const { isExpired, isInvalid } = useJwt(token);

        if (token && !isExpired && !isInvalid) {
            return <Navigate to="/" />;
        }

        return element;
    };
    return (
        <div className="App">
            <Routes>
                {/* start route dashboard */}
                <Route
                    path="/"
                    element={<ProtectedRoute element={<Admin_Dashboard />} />}
                ></Route>
                <Route
                    path="/teacher-dashboard"
                    element={<ProtectedRoute element={<Teacher_Dashboard />} />}
                ></Route>
                {/* end route dashboard */}

                {/* star route exam */}
                <Route
                    path="/exam-list"
                    element={<ProtectedRoute element={<Exam_List />} />}
                ></Route>
                <Route
                    path="/exam-create"
                    element={<ProtectedRoute element={<Exam_Create />} />}
                ></Route>
                <Route
                    path="/exam-edit/:slug"
                    element={<ProtectedRoute element={<Exam_Edit />} />}
                ></Route>
                <Route
                    path="/test-of-exam-list/:id"
                    element={<Test_Of_Exam_List />}
                ></Route>
                <Route
                    path="/test-list"
                    element={<ProtectedRoute element={<Test_List />} />}
                ></Route>
                <Route
                    path="/test-create"
                    element={<ProtectedRoute element={<Test_Create />} />}
                ></Route>
                <Route
                    path="/test-edit/:slug"
                    element={<ProtectedRoute element={<Test_Edit />} />}
                ></Route>
                <Route
                    path="/test-excel"
                    element={<ProtectedRoute element={<Test_Excel_Create />} />}
                ></Route>
                <Route
                    path="/test-available"
                    element={<ProtectedRoute element={<Test_Avaliable />} />}
                ></Route>
                <Route
                    path="/test-essay-create"
                    element={<ProtectedRoute element={<Test_Essay_Create />} />}
                ></Route>
                {/* end route exam */}

                {/* start route classes */}
                <Route
                    path="/classes-list"
                    element={<ProtectedRoute element={<Classes_List />} />}
                ></Route>
                <Route
                    path="/class-create"
                    element={<ProtectedRoute element={<Classes_Create />} />}
                ></Route>
                <Route
                    path="/classes-edit/:slug"
                    element={<ProtectedRoute element={<Classes_Edit />} />}
                ></Route>
                <Route
                    path="/student-of-class-list/:id"
                    element={
                        <ProtectedRoute element={<Student_Of_Class_List />} />
                    }
                ></Route>
                {/* end route course */}

                {/* start route course */}
                <Route
                    path="/course-list"
                    element={<ProtectedRoute element={<Course_List />} />}
                ></Route>
                <Route
                    path="/course-create"
                    element={<ProtectedRoute element={<Course_Create />} />}
                ></Route>
                <Route
                    path="/course-class-create"
                    element={
                        <ProtectedRoute element={<Course_Class_Create />} />
                    }
                ></Route>
                {/* end route course */}

                {/* start route teacher */}
                <Route
                    path="/teacher-list"
                    element={<ProtectedRoute element={<Teacher_List />} />}
                ></Route>
                <Route
                    path="/teacher-create"
                    element={<ProtectedRoute element={<Teacher_Create />} />}
                ></Route>
                {/* end route teacher */}

                {/* start route student */}
                <Route path="/student-list" element={<Student_List />}></Route>
                <Route
                    path="/student-create"
                    element={<ProtectedRoute element={<Student_Create />} />}
                ></Route>
                <Route
                    path="/student-edit/:student_code"
                    element={<ProtectedRoute element={<Student_Edit />} />}
                ></Route>
                <Route
                    path="/student-deleteat"
                    element={<ProtectedRoute element={<Student_DeleteAt />} />}
                ></Route>
                {/* end route student */}

                {/* start route blog */}
                <Route
                    path="/blog-list"
                    element={<ProtectedRoute element={<Blog_List />} />}
                ></Route>
                <Route
                    path="/blog-create"
                    element={<ProtectedRoute element={<Blog_Create />} />}
                ></Route>
                {/* end route blog */}
                <Route
                    path="/profile"
                    element={<ProtectedRoute element={<Profile />} />}
                ></Route>
                <Route
                    path="/login"
                    element={<ProtectedLoginRoute element={<Login />} />}
                />

                <Route
                    path="/forgot-password"
                    element={<ProtectedLoginRoute element={<ForgotPassword />} />}
                />

                 <Route
                    path="/reset-password/:resetToken"
                    element={<ProtectedLoginRoute element={<ResetPassword />} />}
                />
            </Routes>
        </div>
    );
}

export default App;
