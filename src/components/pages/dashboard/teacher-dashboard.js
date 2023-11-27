import { useCallback, useEffect, useState } from "react";
import Layout from "../../layouts/layouts";
import { Helmet } from "react-helmet";
import Loading from "../../layouts/loading";
import { useJwt } from "react-jwt";
import api from "../../services/api";
import url from "../../services/url";
import { format } from "date-fns";
import { Link } from "react-router-dom";
function Teacher_Dashboard() {
    const [loading, setLoading] = useState(true);
    const [staffId, setStaffId] = useState("");
    const [staffName, setStaffName] = useState("");
    const [latestClass, setLatestClass] = useState([]);
    const [recentTest, setRecentTest] = useState([]);
    const [noScore, setNoScore] = useState([]);
    const [totalClass, setTotalClass] = useState([]);
    const [statsGrade, setStatsGrade] = useState([]);
    const [totalTest, setTotalTest] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    });

    const { isExpired, isInvalid } = useJwt();

    useEffect(() => {
        const staffToken = localStorage.getItem("accessToken");

        try {
            const decodedToken = JSON.parse(atob(staffToken.split(".")[1]));

            const staffId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
            const staffName = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

            setStaffName(staffName);
            setStaffId(staffId);
        } catch (error) {}
    }, [isExpired, isInvalid]);

    const loadData = useCallback(async () => {
        try {
            const latestTestResponse = await api.get(url.DASHBOARD.TEACHER.LATEST_CLASSES + `/${staffId}`);
            const recentTestResponse = await api.get(url.DASHBOARD.TEACHER.RECENT_TESTS + `/${staffId}`);
            const noScoreResponse = await api.get(url.DASHBOARD.TEACHER.NO_SCORE + `/${staffId}`);
            const totalClassesResponse = await api.get(url.DASHBOARD.TEACHER.TOTAL_CLASS + `/${staffId}`);
            const statsGradeResponse = await api.get(url.DASHBOARD.TEACHER.STATS_GRADE + `/${staffId}`);
            const totalTestResponse = await api.get(url.DASHBOARD.TEACHER.TOTAL_TESTS + `/${staffId}`);

            setLatestClass(latestTestResponse.data);
            setRecentTest(recentTestResponse.data);
            setNoScore(noScoreResponse.data);
            setTotalClass(totalClassesResponse.data);
            setStatsGrade(statsGradeResponse.data);
            setTotalTest(totalTestResponse.data);
        } catch (error) {}
    }, [staffId]);

    useEffect(() => {
        loadData();
    }, [staffId, loadData]);

    return (
        <>
            {loading ? <Loading /> : ""}
            <Helmet>
                <title>Dashboard | Examonimy</title>
            </Helmet>

            <Layout>
                <div className="page-header">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="page-sub-header">
                                <h3 className="page-title">Welcome {staffName}!</h3>
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <a href="index.html">Home</a>
                                    </li>
                                    <li className="breadcrumb-item active">Teacher</li>
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
                                        <h6>Total Classes</h6>
                                        <h3>{totalClass.totalClass}</h3>
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
                                        <h6>Tests In Progress</h6>
                                        <h3>
                                            {totalTest.examsInProgress}/{totalTest.totalTests}
                                        </h3>
                                    </div>
                                    <div className="db-icon">
                                        <img src="assets/img/icons/teacher-icon-02.svg" alt="Dashboard Icon" />
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
                                        <h6>Practical Not Yet Score</h6>
                                        <h3>
                                            {noScore.essayNoScoreTest}/{noScore.totalEssayTest}
                                        </h3>
                                    </div>
                                    <div className="db-icon">
                                        <img src="assets/img/icons/teacher-icon-03.svg" alt="Dashboard Icon" />
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
                                <h5 className="card-title">Latest Classes</h5>
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
                                                <th>No.</th>
                                                <th>Class Name</th>
                                                <th>Room</th>
                                                <th>Start date</th>
                                                <th className="text-end">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {latestClass.length > 0 ? (
                                                latestClass.map((item, index) => {
                                                    const orderNumber = index + 1;
                                                    return (
                                                        <tr key={index}>
                                                            <td className="text-nowrap">
                                                                <div>{orderNumber}</div>
                                                            </td>
                                                            <td className="text-nowrap">
                                                                <div>{item.name}</div>
                                                            </td>
                                                            <td className="text-nowrap">{item.room}</td>
                                                            <td className="text-nowrap">
                                                                <div>{format(new Date(item.createdAt), "dd/MM/yyyy")}</div>
                                                            </td>
                                                            <td className="text-end">
                                                                <Link to={`/student-of-class-list/${item.id}`} className="btn btn-sm bg-success-light me-2">
                                                                    <i className="feather-eye"></i>
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td>No data available for latest classes.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6 d-flex">
                        <div className="card flex-fill student-space comman-shadow">
                            <div className="card-header d-flex align-items-center">
                                <h5 className="card-title">Recent Tests</h5>
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
                                                <th>No.</th>
                                                <th>Test Name</th>
                                                <th>Class Name</th>
                                                <th>Start date</th>
                                                <th className="text-end">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentTest.length > 0 ? (
                                                recentTest.map((item, index) => {
                                                    const orderNumber = index + 1;
                                                    return (
                                                        <tr key={index}>
                                                            <td className="text-nowrap">
                                                                <div>{orderNumber}</div>
                                                            </td>
                                                            <td className="text-nowrap">
                                                                <div>{item.testName}</div>
                                                            </td>
                                                            <td className="text-nowrap">{item.className}</td>
                                                            <td className="text-nowrap">
                                                                <div>{format(new Date(item.createdAt), "dd/MM/yyyy")}</div>
                                                            </td>
                                                            <td className="text-end">
                                                                <Link to={`/test-view-essay/${item.testSlug}`} className="btn btn-sm bg-success-light me-2">
                                                                    <i className="feather-eye"></i>
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td>No data available for recent tests.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xl-12 d-flex">
                        <div className="card flex-fill student-space comman-shadow">
                            <div className="card-header d-flex align-items-center">
                                <h5 className="card-title">Test Grade Stats</h5>
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
                                                <th>No.</th>
                                                <th>Class Name</th>
                                                <th>Test Name</th>
                                                <th>Average Score</th>
                                                <th>Start date</th>
                                                <th>End date</th>
                                                <th className="text-end">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {statsGrade.length > 0 ? (
                                                statsGrade.map((item, index) => {
                                                    const orderNumber = index + 1;
                                                    const testViewLink = item.typeTest === 0 ? `/test-view-teacher/${item.testSlug}` : `/test-view-essay-teacher/${item.testSlug}`;
                                                    return (
                                                        <tr key={index}>
                                                            <td className="text-nowrap">
                                                                <div>{orderNumber}</div>
                                                            </td>
                                                            <td>{item.className}</td>
                                                            <td className="text-nowrap">
                                                                <div>
                                                                    {item.testName} ({item.retake_test_id === null ? "Main test" : "Retake test"})
                                                                </div>
                                                            </td>
                                                            <td className="text-nowrap">{item.averageScore}</td>
                                                            <td className="text-nowrap">
                                                                <div>{format(new Date(item.startDate), "dd/MM/yyyy")}</div>
                                                            </td>
                                                            <td className="text-nowrap">
                                                                <div>{format(new Date(item.endDate), "dd/MM/yyyy")}</div>
                                                            </td>
                                                            <td className="text-end">
                                                                <Link to={testViewLink} className="btn btn-sm bg-success-light me-2">
                                                                    <i className="feather-eye"></i>
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td>No data available for test grade stats.</td>
                                                </tr>
                                            )}
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
    );
}
export default Teacher_Dashboard;
