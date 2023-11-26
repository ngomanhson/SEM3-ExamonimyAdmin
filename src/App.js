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
import Login from "./components/pages/auth/login";
import { useJwt } from "react-jwt";
import Profile from "./components/pages/auth/profile";
import Test_View from "./components/pages/exam/test/test-view";
import Test_View_Essay from "./components/pages/exam/test/test-view-essay";
import ForgotPassword from "./components/pages/auth/forgot-password";
import ResetPassword from "./components/pages/auth/reset-password";
import NotFound from "./components/pages/other/not-found";
import Retest_List from "./components/pages/exam/retest-list";
import TestExcel_Create from "./components/pages/exam/retest/testexcel-create";
import TestAvaliable_Create from "./components/pages/exam/retest/testavaliable-create";
import TestByHand_Create from "./components/pages/exam/retest/testbyhand-create";
import EssayTest_Create from "./components/pages/exam/retest/essaytest-create";
import TestEssay_CreateAuto from "./components/pages/exam/test/test-essay-create-auto";
import EssayTest_CreateAuto from "./components/pages/exam/retest/essaytest-createauto";
import ClassCourse_List from "./components/pages/classescourse/classescourse";
import Staff_Dashboard from "./components/pages/dashboard/staff-dashboard";
import TestByTeacher_List from "./components/pages/teacher/testbyteacher-list";
import ClassByTeacher_List from "./components/pages/teacher/classbyteacher-list";
import Add_ClassCourse from "./components/pages/classescourse/add-classcourse";
import StudentExcel_Create from "./components/pages/student/studentexcel-create";
import Test_View_Teacher from "./components/pages/teacher/test-view-teacher";
import Test_View_Essay_Teacher from "./components/pages/teacher/test-view-essay-teacher";
import Class_Detail_Teacher from "./components/pages/teacher/class-view-teacher";
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
                <Route path="/" element={<ProtectedRoute element={<Admin_Dashboard />} />}></Route>
                <Route path="/staff-dashboard" element={<ProtectedRoute element={<Staff_Dashboard />} />}></Route>
                <Route path="/teacher-dashboard" element={<ProtectedRoute element={<Teacher_Dashboard />} />}></Route>
                {/* end route dashboard */}

                {/* star route exam */}
                <Route path="/exam-list" element={<ProtectedRoute element={<Exam_List />} />}></Route>
                <Route path="/exam-create" element={<ProtectedRoute element={<Exam_Create />} />}></Route>
                <Route path="/exam-edit/:slug" element={<ProtectedRoute element={<Exam_Edit />} />}></Route>
                <Route path="/test-of-exam-list/:id" element={<Test_Of_Exam_List />}></Route>
                <Route path="/test-list" element={<ProtectedRoute element={<Test_List />} />}></Route>
                <Route path="/test-view/:slug" element={<ProtectedRoute element={<Test_View />} />}></Route>
                <Route path="/test-view-essay/:slug" element={<ProtectedRoute element={<Test_View_Essay />} />}></Route>
                <Route path="/test-create" element={<ProtectedRoute element={<Test_Create />} />}></Route>
                <Route path="/test-edit/:slug" element={<ProtectedRoute element={<Test_Edit />} />}></Route>
                <Route path="/test-excel" element={<ProtectedRoute element={<Test_Excel_Create />} />}></Route>
                <Route path="/test-available" element={<ProtectedRoute element={<Test_Avaliable />} />}></Route>
                <Route path="/test-essay-create" element={<ProtectedRoute element={<Test_Essay_Create />} />}></Route>
                <Route path="/test-essay-create-auto" element={<ProtectedRoute element={<TestEssay_CreateAuto />} />}></Route>
                {/* end route exam */}

                {/* start retest route */}
                <Route path="/retest-list" element={<ProtectedRoute element={<Retest_List />} />}></Route>
                <Route path="/retest-byhand-create" element={<ProtectedRoute element={<TestByHand_Create />} />}></Route>
                <Route path="/retest-excel-create" element={<ProtectedRoute element={<TestExcel_Create />} />}></Route>
                <Route path="/retest-avaliable-create" element={<ProtectedRoute element={<TestAvaliable_Create />} />}></Route>
                <Route path="/retest-essay-byhand-create" element={<ProtectedRoute element={<EssayTest_Create />} />}></Route>
                <Route path="/retest-essay-auto-create" element={<ProtectedRoute element={<EssayTest_CreateAuto />} />}></Route>
                {/* end retest route */}

                {/* start route classes */}
                <Route path="/classes-list" element={<ProtectedRoute element={<Classes_List />} />}></Route>
                <Route path="/class-create" element={<ProtectedRoute element={<Classes_Create />} />}></Route>
                <Route path="/classes-edit/:slug" element={<ProtectedRoute element={<Classes_Edit />} />}></Route>
                <Route path="/student-of-class-list/:id" element={<ProtectedRoute element={<Student_Of_Class_List />} />}></Route>
                {/* end route course */}

                {/* start route course */}
                <Route path="/course-list" element={<ProtectedRoute element={<Course_List />} />}></Route>
                <Route path="/course-create" element={<ProtectedRoute element={<Course_Create />} />}></Route>
                {/* end route course */}

                {/* start route classcourse */}
                <Route path="/courseclass-list" element={<ProtectedRoute element={<ClassCourse_List />} />}></Route>
                <Route path="/course-class-create" element={<ProtectedRoute element={<Add_ClassCourse />} />}></Route>
                {/* end route classcourse */}

                {/* start route teacher */}
                <Route path="/teacher-list" element={<ProtectedRoute element={<Teacher_List />} />}></Route>
                <Route path="/teacher-create" element={<ProtectedRoute element={<Teacher_Create />} />}></Route>
                <Route path="/testbyteacher-list" element={<ProtectedRoute element={<TestByTeacher_List />} />}></Route>
                <Route path="/test-view-teacher/:slug" element={<ProtectedRoute element={<Test_View_Teacher />} />}></Route>
                <Route path="/test-view-essay-teacher/:slug" element={<ProtectedRoute element={<Test_View_Essay_Teacher />} />}></Route>
                <Route path="/classesbyteacher-list" element={<ProtectedRoute element={<ClassByTeacher_List />} />}></Route>
                <Route path="/classes-detail-teacher/:id" element={<ProtectedRoute element={<Class_Detail_Teacher />} />}></Route>
                {/* end route teacher */}

                {/* start route student */}
                <Route path="/student-list" element={<Student_List />}></Route>
                <Route path="/student-create" element={<ProtectedRoute element={<Student_Create />} />}></Route>
                <Route path="/student-excel-create" element={<ProtectedRoute element={<StudentExcel_Create />} />}></Route>
                <Route path="/student-edit/:student_code" element={<ProtectedRoute element={<Student_Edit />} />}></Route>
                <Route path="/student-deleteat" element={<ProtectedRoute element={<Student_DeleteAt />} />}></Route>
                {/* end route student */}

                <Route path="/profile" element={<ProtectedRoute element={<Profile />} />}></Route>
                <Route path="/login" element={<ProtectedLoginRoute element={<Login />} />} />

                <Route path="/forgot-password" element={<ProtectedLoginRoute element={<ForgotPassword />} />} />

                <Route path="/reset-password/:resetToken" element={<ProtectedLoginRoute element={<ResetPassword />} />} />

                <Route path="*" element={<ProtectedRoute element={<NotFound />} />} />
            </Routes>
        </div>
    );
}

export default App;
