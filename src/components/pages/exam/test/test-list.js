import { NavLink, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import url from "../../../services/url";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import { useJwt } from "react-jwt";
import Layout from "../../../layouts/layouts";
import Loading from "../../../layouts/loading";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import NotFound from "../../../pages/other/not-found";
import { formatISO } from "date-fns";
function Test_List() {
    const { id } = useParams();
    const [tests, setTests] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [search, setSearch] = useState("");
    const [from, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [sortBy, setSortBy] = useState("");
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    const handleSearchChange = (e) => setSearch(e.target.value);
    const handleFromDateChange = (date) => {
        const isoFormattedDate = formatISO(new Date(date), { representation: "complete" });
        const formattedDate = isoFormattedDate.slice(0, 16);
        setFromDate(formattedDate);
    };
    const handleToDateChange = (date) => setToDate(date);
    const handleSortByChange = (e) => setSortBy(e.target.value);
    //reset lọc
    const handleResetFilters = () => {
        setSearch("");
        setFromDate("");
        setToDate("");
        setSortBy("");
        setPage(1);
    };

    //hiển thị test list
    const loadTestList = async () => {
        const userToken = localStorage.getItem("accessToken");
        try {
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            const response = await api.get(url.TEST.LIST, {
                params: {
                    search,
                    from,
                    toDate,
                    sortBy,
                    page,
                },
            });
            setTests(response.data.data);
        } catch (error) {
            console.error("Error loading test list:", error);
        }
    };

    //kiểm tra edit bài test
    const canEditTest = (startDate) => {
        const currentDate = Date.now();
        return startDate > currentDate;
    };

    //kiểm tra role
    const fetchUserRole = async () => {
        const token = localStorage.getItem("accessToken");
        try {
            const decodedToken = JSON.parse(atob(token.split(".")[1]));
            const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            setUserRole(userRole);
        } catch (error) {
            console.error("Error loading user role:", error);
        }
    };

    //paginate
    const handleNextPage = () => {
        setPage((prevPage) => prevPage + 1);
    };
    const handlePrevPage = () => {
        setPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
        loadTestList();
        fetchUserRole();
    }, [navigate, search, from, toDate, sortBy, page]);
    return (
        <>
            {loading ? <Loading /> : ""}
            {error ? (
                <NotFound />
            ) : (
                <>
                    <Helmet>
                        <title>Test | Examonimy</title>
                    </Helmet>
                    <Layout>
                        <div className="page-header">
                            <div className="row align-items-center">
                                <div className="col">
                                    <h3 className="page-title">Test List</h3>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card card-table">
                                    <div className="card-body">
                                        <div id="notification-container"></div>

                                        <div className="row align-items-center">
                                            <h5 className="card-title">
                                                List of tests
                                                {userRole === "Staff" || userRole === "Super Admin" ? (
                                                    <NavLink to={`/test-create`} data-bs-toggle="modal" data-bs-target="#signup-modal" className="btn btn-primary float-sm-end m-l-10">
                                                        Add New Test
                                                    </NavLink>
                                                ) : null}
                                            </h5>

                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label>Search:</label>
                                                    <input type="text" className="form-control" placeholder="Search" value={search} onChange={handleSearchChange} />
                                                </div>
                                            </div>

                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label>From Date:</label>
                                                    <input type="datetime-local" className="form-control" value={from} onChange={(e) => handleFromDateChange(e.target.value)} />
                                                </div>
                                                {/* <div className="form-group">
                                                    <label>To Date:</label>
                                                    <input type="date" className="form-control" onChange={(e) => handleToDateChange(e.target.value)} />
                                                </div> */}
                                            </div>

                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label>Sort By:</label>
                                                    <select className="form-control" value={sortBy} onChange={handleSortByChange}>
                                                        <option value="">Default</option>
                                                        <option value="name_desc">Name (Desc)</option>
                                                        <option value="createAt_asc">Start Date At (Asc)</option>
                                                        <option value="createAt_desc">Start Date At (Desc)</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-3 text-end">
                                                <button className="btn btn-secondary" onClick={handleResetFilters}>
                                                    Reset Filters
                                                </button>
                                            </div>
                                        </div>

                                        <div className="table-responsive">
                                            <table className="table border-0 star-student table-hover table-center mb-0 datatable table-striped">
                                                <thead className="student-thread">
                                                    <tr>
                                                        <th>Ordinal</th>
                                                        <th>Name Test</th>
                                                        <th>Type Test</th>
                                                        <th>Start Date Time</th>
                                                        <th>End Date Time</th>
                                                        <th>Past Marks</th>
                                                        <th className="text-end">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {tests.map((item, index) => {
                                                        const isEditable = canEditTest(new Date(item.startDate));
                                                        const testViewLink = item.type_test === 0 ? `/test-view/${item.slug}` : `/test-view-essay/${item.slug}`;
                                                        return (
                                                            <tr>
                                                                <td>{index + 1}</td>
                                                                <td>{item.name}</td>
                                                                <td>{item.type_test === 0 ? "Multiple Choice" : "Essay Test"}</td>
                                                                <td>{format(new Date(item.startDate), "yyyy-MM-dd HH:mm")}</td>
                                                                <td>{format(new Date(item.endDate), "yyyy-MM-dd HH:mm")}</td>
                                                                <td>
                                                                    {item.past_marks}
                                                                    /100
                                                                </td>
                                                                <td className="text-end">
                                                                    <div className="actions">
                                                                        <NavLink to={testViewLink} className="btn btn-sm bg-success-light me-2">
                                                                            <i className="feather-eye"></i>
                                                                        </NavLink>
                                                                        {isEditable ? (
                                                                            <NavLink to={`/test-edit/${item.slug}`} className="btn btn-sm bg-danger-light">
                                                                                <i className="feather-edit"></i>
                                                                            </NavLink>
                                                                        ) : (
                                                                            <NavLink
                                                                                onClick={() =>
                                                                                    toast.warning("This test cannot be edited because this test is being taken or has already been taken!", {
                                                                                        position: toast.POSITION.TOP_RIGHT,
                                                                                        autoClose: 3000,
                                                                                    })
                                                                                }
                                                                                className="btn btn-sm bg-danger-light"
                                                                            >
                                                                                <i className="feather-edit"></i>
                                                                            </NavLink>
                                                                        )}
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
                        <div className="text-center">
                            <button className="btn btn-secondary me-2" onClick={handlePrevPage} disabled={page === 1}>
                                Previous Page
                            </button>
                            <span>Page {page}</span>
                            <button className="btn btn-secondary ms-2" onClick={handleNextPage} disabled={tests.length === 0}>
                                Next Page
                            </button>
                        </div>
                        <div id="signup-modal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-body">
                                        <div class="text-center mt-2 mb-4">
                                            <div class="auth-logo">
                                                <a href="index.html" class="logo logo-dark">
                                                    <span class="logo-lg">
                                                        <img src="assets/img/logo.png" alt height="42" />
                                                    </span>
                                                </a>
                                            </div>
                                        </div>
                                        <div class="text-center mt-2 mb-4">
                                            <h6>Do you want to create a multiple choice or essay test?</h6>
                                        </div>
                                        <div class="text-center mt-2 mb-4">
                                            <NavLink
                                                to="/test-create"
                                                style={{
                                                    color: "white",
                                                }}
                                            >
                                                <button class="btn btn-primary" data-bs-dismiss="modal">
                                                    Multiple choice
                                                </button>
                                            </NavLink>
                                            <NavLink
                                                to="/test-essay-create"
                                                style={{
                                                    color: "white",
                                                }}
                                            >
                                                {" "}
                                                <button
                                                    class="btn btn-primary"
                                                    data-bs-dismiss="modal"
                                                    style={{
                                                        color: "white",
                                                        marginLeft: "10px",
                                                    }}
                                                >
                                                    Essay test
                                                </button>
                                            </NavLink>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ToastContainer />
                    </Layout>
                </>
            )}
        </>
    );
}
export default Test_List;
