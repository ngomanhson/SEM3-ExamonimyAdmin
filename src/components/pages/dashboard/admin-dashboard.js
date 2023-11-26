import { useEffect, useState } from "react";
import Layout from "../../layouts/layouts";
import { Helmet } from "react-helmet";
import Loading from "../../layouts/loading";
import NotFound from "../../pages/other/not-found";
import { NavLink, useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import api from "../../services/api";
import url from "../../services/url";
import Select from "react-select";
import makeAnimated from "react-select/animated";
function Admin_Dashboard() {
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [userStats, setUserStats] = useState({
        totalUsers: "",
        enrolledStudents: "",
        totalTeachers: "",
        totalStaffs: "",
    });
    const [testStats, setTestStats] = useState({
        totalTests: "",
        examsInProgress: "",
    });
    const [registerExamStats, setRegisterExamStats] = useState({
        totalRegistrations: "",
        approvedRegistrations: "",
        pendingRegistrations: "",
        completedRegistration: "",
    });
    const [chartDataGender, setChartData] = useState({});
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isSearchable, setIsSearchable] = useState(true);
    const [testStatsByCourse, setTestStatsByCourse] = useState([]);
    const [chartDataAverage, setChartDataAverage] = useState({});
    const [recentTest, setRecentTest] = useState([]);
    const [highTest, setHighTest] = useState([]);

    //hiển thị thông tin user, staff, test
    const fetchUserStats = async () => {
        try {
            const response = await api.get(url.DASHBOARD.ADMIN.USER_STATS);
            setUserStats(response.data);
        } catch (error) {}
    };
    const fetchTestStats = async () => {
        try {
            const response = await api.get(url.DASHBOARD.ADMIN.TEST_STATS);
            setTestStats(response.data);
        } catch (error) {}
    };
    useEffect(() => {
        fetchUserStats();
        fetchTestStats();
    }, []);
    //hiển thị thông tin registerExam
    const fetchRegisterExamStats = async () => {
        try {
            const response = await api.get(url.DASHBOARD.ADMIN.REGISTER_EXAM_STATS);
            setRegisterExamStats(response.data);
        } catch (error) {}
    };
    useEffect(() => {
        fetchRegisterExamStats();
    }, []);

    //hien thi select khoa hoc
    const fetchCourses = async () => {
        const userToken = localStorage.getItem("accessToken");
        try {
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            const response = await api.get(url.COURSE.LIST);
            const courseData = response.data.data
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((course) => ({
                    value: course.id,
                    label: course.name,
                }));
            setCourses(courseData);
        } catch (error) {}
    };
    const courseOptionsWithTestStats = courses.map((course) => {
        const testStats = testStatsByCourse.find((stats) => stats.courseName === course.label);
        const testsCount = testStats ? testStats.numberOfExams : 0;
        return {
            ...course,
            label: `${course.label} (${testsCount} tests)`, //hiển thị số bài test của courrse
        };
    });
    const handleChangeCourse = (selectedOption) => {
        setSelectedCourse(selectedOption);
    };

    //biểu đồ điểm trung bình theo môn
    const fetchAverageDate = async () => {
        try {
            const courseId = selectedCourse ? selectedCourse.value : null;
            const urlWithCourseId = url.DASHBOARD.ADMIN.AVERAGE.replace("{}", courseId);
            const response = await api.get(urlWithCourseId);
            const responseTestStats = await api.get(url.DASHBOARD.ADMIN.TEST_COURSE); //lấy ra số lượng bài test theo môn
            setTestStatsByCourse(responseTestStats.data);
            const averageData = response.data;
            const averageScoreTruncated = averageData.map((data) => {
                return {
                    ...data,
                    averageScore: Number(data.averageScore.toFixed(2)),
                };
            });
            const newChartDataAverage = {
                series: [
                    {
                        name: "Average Score",
                        data: averageScoreTruncated.map((data) => data.averageScore),
                    },
                ],
                options: {
                    chart: {
                        height: 350,
                        type: "area",
                    },
                    dataLabels: {
                        enabled: false,
                    },
                    stroke: {
                        curve: "smooth",
                    },
                    xaxis: {
                        type: "datetime",
                        categories: averageScoreTruncated.map((data) => data.year.toString()),
                    },
                    tooltip: {
                        x: {
                            format: "dd/MM/yy HH:mm",
                        },
                    },
                },
            };

            setChartDataAverage(newChartDataAverage);
        } catch (error) {}
    };

    //biểu đồ giới tính
    const fetchGenderData = async () => {
        try {
            const response = await api.get(url.DASHBOARD.ADMIN.GENDER);
            const genderData = response.data;
            const lastTenYears = Array.from({ length: 10 }, (_, index) => new Date().getFullYear() - index);
            const lastTenYearsData = lastTenYears.map((year) => {
                const yearData = genderData.find((data) => data.year === year);
                return yearData || { year, genderDistribution: [] };
            });
            const maleData = [];
            const femaleData = [];
            lastTenYearsData.forEach((yearData) => {
                const male = yearData.genderDistribution.find((item) => item.gender === "Male");
                const female = yearData.genderDistribution.find((item) => item.gender === "FeMale");

                maleData.push(male ? male.studentCount : 0);
                femaleData.push(female ? female.studentCount : 0);
            });

            const newChartData = {
                series: [
                    {
                        name: "Male",
                        data: maleData,
                    },
                    {
                        name: "Female",
                        data: femaleData,
                    },
                ],
                options: {
                    chart: {
                        type: "bar",
                        height: 700,
                    },
                    plotOptions: {
                        bar: {
                            horizontal: false,
                            columnWidth: "55%",
                            endingShape: "rounded",
                        },
                    },
                    dataLabels: {
                        enabled: false,
                    },
                    stroke: {
                        show: true,
                        width: 2,
                        colors: ["transparent"],
                    },
                    xaxis: {
                        categories: lastTenYearsData.map((yearData) => yearData.year.toString()),
                    },
                    yaxis: {
                        title: {
                            text: "(quantity)",
                        },
                    },
                    fill: {
                        opacity: 1,
                    },
                    tooltip: {
                        y: {
                            formatter: function (val) {
                                return val + " students";
                            },
                        },
                    },
                },
            };

            setChartData(newChartData);
        } catch (error) {
            console.error("Error fetching gender data:", error);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (courses.length > 0) {
            setSelectedCourse(courses[0]);
        }
    }, [courses]);

    useEffect(() => {
        fetchAverageDate();
        fetchGenderData();
    }, [selectedCourse]);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    useEffect(() => {
        const fetchUserRole = async () => {
            const token = localStorage.getItem("accessToken");
            try {
                const decodedToken = JSON.parse(atob(token.split(".")[1]));
                const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                setUserRole(userRole);

                if (userRole === "Teacher" || userRole === "Staff") {
                    setError(true);
                }
            } catch (error) {
                console.error("Error loading user role:", error);
            }
        };

        fetchUserRole();
    }, [navigate]);

    const loadTests = async () => {
        try {
            const response = await api.get(url.DASHBOARD.ADMIN.RECENT_TEST);
            setRecentTest(response.data);
        } catch (error) {}
    };
    const loadHighTests = async () => {
        try {
            const response = await api.get(url.DASHBOARD.ADMIN.HIGH_AVERAGE);
            setHighTest(response.data);
        } catch (error) {}
    };
    useEffect(() => {
        loadTests();
        loadHighTests();
    }, []);
    return (
        <>
            {loading ? <Loading /> : ""}
            {error ? (
                <NotFound />
            ) : (
                <>
                    <Helmet>
                        <title>Dashboard | Examonimy</title>
                    </Helmet>
                    <Layout>
                        <div className="page-header">
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="page-sub-header">
                                        <h3 className="page-title">Welcome Admin!</h3>
                                        <ul className="breadcrumb">
                                            <li className="breadcrumb-item">
                                                <a href="index.html">Home</a>
                                            </li>
                                            <li className="breadcrumb-item active">Admin</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-xl-4 col-sm-6 col-12 d-flex">
                                <div className="card bg-comman w-100">
                                    <div className="card-body">
                                        <div className="db-widgets d-flex justify-content-between align-items-center">
                                            <div className="db-info">
                                                <h6>Students</h6>
                                                <h3>
                                                    {`${userStats.enrolledStudents}/ ${userStats.totalUsers}`}{" "}
                                                    <span
                                                        style={{
                                                            fontSize: "16px",
                                                        }}
                                                    >
                                                        Total Students
                                                    </span>
                                                </h3>
                                            </div>
                                            <div className="db-icon">
                                                <img src="assets/img/icons/dash-icon-01.svg" alt="Dashboard Icon" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-4 col-sm-6 col-12 d-flex">
                                <div className="card bg-comman w-100">
                                    <div className="card-body">
                                        <div className="db-widgets d-flex justify-content-between align-items-center">
                                            <div className="db-info">
                                                <h6>Staff</h6>
                                                <h3>
                                                    {userStats.totalTeachers}{" "}
                                                    <span
                                                        style={{
                                                            fontSize: "16px",
                                                        }}
                                                    >
                                                        Teacher
                                                    </span>
                                                    / {userStats.totalStaffs}{" "}
                                                    <span
                                                        style={{
                                                            fontSize: "16px",
                                                        }}
                                                    >
                                                        Staff
                                                    </span>
                                                </h3>
                                            </div>
                                            <div className="db-icon">
                                                <img src="assets/img/icons/staff.svg" alt="Dashboard Icon" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-4 col-sm-6 col-12 d-flex">
                                <div className="card bg-comman w-100">
                                    <div className="card-body">
                                        <div className="db-widgets d-flex justify-content-between align-items-center">
                                            <div className="db-info">
                                                <h6>The Tests</h6>
                                                <h3>
                                                    {" "}
                                                    {testStats.examsInProgress}{" "}
                                                    <span
                                                        style={{
                                                            fontSize: "16px",
                                                        }}
                                                    >
                                                        In Progress
                                                    </span>
                                                    /{testStats.totalTests}
                                                </h3>
                                            </div>
                                            <div className="db-icon">
                                                <img src="assets/img/icons/test.svg" alt="Dashboard Icon" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="col-xl-3 col-sm-6 col-12 d-flex">
                                <div className="card bg-comman w-100">
                                    <div className="card-body">
                                        <div className="db-widgets d-flex justify-content-between align-items-center">
                                            <div className="db-info">
                                                <h6>Retest</h6>
                                                <h3>$505</h3>
                                            </div>
                                            <div className="db-icon">
                                                <img src="assets/img/icons/retest.svg" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                        </div>

                        <div className="row">
                            <div className="col-md-12 col-lg-6">
                                <div className="card card-chart">
                                    <div className="card-header">
                                        <div className="row align-items-center">
                                            <div className="col-6">
                                                <h5 className="card-title">Average score by course</h5>
                                            </div>
                                            <div className="col-6">
                                                <ul className="chart-list-out">
                                                    <li className="star-menus">
                                                        <a href="javascript:;">
                                                            <i className="fas fa-ellipsis-v"></i>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div id="chart">
                                            <Chart options={chartDataAverage.options || {}} series={chartDataAverage.series || []} type="area" height={390} />
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-4"></div>
                                            <div class="form-group col-lg-4">
                                                <Select options={courseOptionsWithTestStats} isSearchable={isSearchable} onChange={handleChangeCourse} value={selectedCourse} />
                                                <div className="col-lg-4"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12 col-lg-6">
                                <div className="card card-chart">
                                    <div className="card-header">
                                        <div className="row align-items-center">
                                            <div className="col-6">
                                                <h5 className="card-title">Number of Students</h5>
                                            </div>
                                            <div className="col-6">
                                                <ul className="chart-list-out">
                                                    <li>
                                                        <span className="circle-blue"></span>
                                                        Male
                                                    </li>
                                                    <li>
                                                        <span className="circle-green"></span>
                                                        Female
                                                    </li>
                                                    <li className="star-menus">
                                                        <a href="javascript:;">
                                                            <i className="fas fa-ellipsis-v"></i>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div id="chart">
                                            <Chart options={chartDataGender.options || {}} series={chartDataGender.series || []} type="bar" height={450} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-xl-3 col-sm-6 col-12 d-flex">
                                <div className="card bg-comman w-100">
                                    <div className="card-body">
                                        <div className="db-widgets d-flex justify-content-between align-items-center">
                                            <div className="db-info">
                                                <h6>Total Registrations Retake</h6>
                                                <h3>{registerExamStats.totalRegistrations}</h3>
                                            </div>
                                            <div className="db-icon">
                                                <img src="assets/img/icons/retest.svg" alt="Dashboard Icon" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-sm-6 col-12 d-flex">
                                <div className="card bg-comman w-100">
                                    <div className="card-body">
                                        <div className="db-widgets d-flex justify-content-between align-items-center">
                                            <div className="db-info">
                                                <h6>Approved Registrations</h6>
                                                <h3>{registerExamStats.approvedRegistrations}</h3>
                                            </div>
                                            <div className="db-icon">
                                                <img src="assets/img/icons/teacher-icon-03.svg" alt="Dashboard Icon" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-sm-6 col-12 d-flex">
                                <div className="card bg-comman w-100">
                                    <div className="card-body">
                                        <div className="db-widgets d-flex justify-content-between align-items-center">
                                            <div className="db-info">
                                                <h6>Pending Registrations</h6>
                                                <h3>{registerExamStats.pendingRegistrations}</h3>
                                            </div>
                                            <div className="db-icon">
                                                <img src="assets/img/icons/teacher-icon-02.svg" alt="Dashboard Icon" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-sm-6 col-12 d-flex">
                                <div className="card bg-comman w-100">
                                    <div className="card-body">
                                        <div className="db-widgets d-flex justify-content-between align-items-center">
                                            <div className="db-info">
                                                <h6>Completed Registration</h6>
                                                <h3>{registerExamStats.completedRegistration}</h3>
                                            </div>
                                            <div className="db-icon">
                                                <img src="assets/img/icons/complete.svg" alt="Dashboard Icon" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-xl-6 d-flex">
                                <div className="card flex-fill student-space comman-shadow">
                                    <div className="card-header d-flex align-items-center">
                                        <h5 className="card-title">Top 10 Recent Tests</h5>
                                        <ul className="chart-list-out student-ellips">
                                            <li className="star-menus">
                                                <a href="javascript:;">
                                                    <i className="fas fa-ellipsis-v"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table star-student table-hover table-center table-borderless table-striped">
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th>Ordinal</th>
                                                        <th>Name</th>
                                                        <th className="text-center">Marks</th>
                                                        <th className="text-center">Type Test</th>
                                                        <th className="text-end">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {recentTest.map((item, index) => {
                                                        const testViewLink = item.type_test === 0 ? `/test-view/${item.slug}` : `/test-view-essay/${item.slug}`;
                                                        return (
                                                            <tr key={index}>
                                                                <td className="text-nowrap">
                                                                    <div>{index + 1}</div>
                                                                </td>
                                                                <td className="text-nowrap">{item.name}</td>
                                                                <td className="text-center">
                                                                    {item.past_marks}/{item.total_marks}
                                                                </td>
                                                                <td className="text-center">{item.type_test === 0 ? "Multiple Choice" : "Essay Test"}</td>
                                                                <td className="text-end">
                                                                    <div>
                                                                        <NavLink className="badge badge-soft-info" to={testViewLink}>
                                                                            View
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
                            <div className="col-xl-6 d-flex">
                                <div className="card flex-fill comman-shadow">
                                    <div className="card-header d-flex align-items-center">
                                        <h5 className="card-title">Top 10 tests with highest average scores</h5>
                                        <ul className="chart-list-out student-ellips">
                                            <li className="star-menus">
                                                <a href="javascript:;">
                                                    <i className="fas fa-ellipsis-v"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table star-student table-hover table-center table-borderless table-striped">
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th>Ordinal</th>
                                                        <th>Name</th>
                                                        <th className="text-center">Marks</th>
                                                        <th className="text-center">Type Test</th>
                                                        <th className="text-end">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {highTest.map((item, index) => {
                                                        const testViewLink = item.type_test === 0 ? `/test-view/${item.slug}` : `/test-view-essay/${item.slug}`;
                                                        return (
                                                            <tr key={index}>
                                                                <td className="text-nowrap">
                                                                    <div>{index + 1}</div>
                                                                </td>
                                                                <td className="text-nowrap">{item.name}</td>
                                                                <td className="text-center">
                                                                    {item.past_marks}/{item.total_marks}
                                                                </td>
                                                                <td className="text-center">{item.type_test === 0 ? "Multiple Choice" : "Essay Test"}</td>
                                                                <td className="text-end">
                                                                    <div>
                                                                        <NavLink className="badge badge-soft-info" to={testViewLink}>
                                                                            View
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

                        <div className="row">
                            <div className="col-xl-3 col-sm-6 col-12">
                                <div className="card flex-fill fb sm-box">
                                    <div className="social-likes">
                                        <p>Like us on facebook</p>
                                        <h6>50,095</h6>
                                    </div>
                                    <div className="social-boxs">
                                        <img src="assets/img/icons/social-icon-01.svg" alt="Social Icon" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-sm-6 col-12">
                                <div className="card flex-fill twitter sm-box">
                                    <div className="social-likes">
                                        <p>Follow us on twitter</p>
                                        <h6>48,596</h6>
                                    </div>
                                    <div className="social-boxs">
                                        <img src="assets/img/icons/social-icon-02.svg" alt="Social Icon" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-sm-6 col-12">
                                <div className="card flex-fill insta sm-box">
                                    <div className="social-likes">
                                        <p>Follow us on instagram</p>
                                        <h6>52,085</h6>
                                    </div>
                                    <div className="social-boxs">
                                        <img src="assets/img/icons/social-icon-03.svg" alt="Social Icon" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-sm-6 col-12">
                                <div className="card flex-fill linkedin sm-box">
                                    <div className="social-likes">
                                        <p>Follow us on linkedin</p>
                                        <h6>69,050</h6>
                                    </div>
                                    <div className="social-boxs">
                                        <img src="assets/img/icons/social-icon-04.svg" alt="Social Icon" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Layout>
                </>
            )}
        </>
    );
}
export default Admin_Dashboard;
