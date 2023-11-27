import { useEffect, useState } from "react";
import api from "../../services/api";
import url from "../../services/url";
import Layout from "../../layouts/layouts";
import { Helmet } from "react-helmet";
import Loading from "../../layouts/loading";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import NotFound from "../../pages/other/not-found";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Question_List_Essay() {
    const [questions, setQuestions] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [questionsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [searchByName, setSearchByName] = useState("");

    const handleSearch = () => {
        const nameRegex = new RegExp(searchByName, "i");

        const filteredQuestions = questions.filter((question) => {
            const nameMatch = nameRegex.test(question.title);
            return nameMatch;
        });

        setQuestions(filteredQuestions);
    };
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    });

    //hiển thị danh sách questions
    const loadQuestions = async () => {
        const userToken = localStorage.getItem("accessToken");
        try {
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            const response = await api.get(url.QUESTION.LIST);
            const multipleChoiceQuestions = response.data.filter((question) => question.type === 1); //chỉ hiện thị câu hỏi trắc nghiệm.
            setQuestions(multipleChoiceQuestions);
            console.log(multipleChoiceQuestions);
        } catch (error) {}
    };

    //kiểm tra role
    useEffect(() => {
        const fetchUserRole = async () => {
            const token = localStorage.getItem("accessToken");
            try {
                const decodedToken = JSON.parse(atob(token.split(".")[1]));
                const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                setUserRole(userRole);

                if (userRole === "Teacher") {
                    setError(true);
                }
            } catch (error) {
                console.error("Error loading user role:", error);
            }
        };

        fetchUserRole();
    }, [navigate]);

    useEffect(() => {
        loadQuestions();
    }, []);

    //paginate
    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    //xử lý xoá cau hoi
    const handleDeleteQuestion = async (id) => {
        const userToken = localStorage.getItem("accessToken");
        try {
            const isConfirmed = await Swal.fire({
                title: "Confirm Delete?",
                text: "Confirm Delete Question",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Confirm",
            });
            if (isConfirmed.isConfirmed) {
                api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
                await api.delete(`${url.QUESTION.DELETE}?id=${id}`);
                setQuestions((prevStudents) => prevStudents.filter((question) => question.id !== id));
                toast.success("Delete Question Successfully", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
            }
        } catch (error) {
            toast.error("Delete Question Failed", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
        }
    };
    return (
        <>
            {loading ? <Loading /> : ""}
            {error ? (
                <NotFound />
            ) : (
                <>
                    <Helmet>
                        <title>Question | Examonimy</title>
                    </Helmet>
                    <Layout>
                        <div className="page-header">
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="page-sub-header">
                                        <h3 className="page-title">Questions</h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="student-group-form">
                            <div className="row">
                                <ul class="list-links col-lg-5">
                                    <li>
                                        <NavLink to="/question-list">Multiple Choice</NavLink>
                                    </li>
                                    <li class="active">
                                        <NavLink to="">Essay</NavLink>
                                    </li>
                                </ul>
                                <div className="col-lg-5">
                                    <div className="form-group">
                                        <input type="text" className="form-control" placeholder="Search by Name ..." value={searchByName} onChange={(e) => setSearchByName(e.target.value)} />
                                    </div>
                                </div>
                                <div className="col-lg-2">
                                    <div className="search-student-btn">
                                        <button type="btn" className="btn btn-primary" onClick={handleSearch}>
                                            Search
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card card-table comman-shadow">
                                    <div className="card-body">
                                        <div className="page-header">
                                            <div className="row align-items-center">
                                                <div className="col">
                                                    <h3 className="page-title">List of essay questions</h3>
                                                </div>
                                                <div className="col-auto text-end float-end ms-auto download-grp">
                                                    <a href="" className="btn btn-outline-gray me-2">
                                                        <i class="fa fa-trash" aria-hidden="true"></i>
                                                    </a>
                                                    <NavLink to="/question-create-essay" className="btn btn-primary">
                                                        <i className="fas fa-plus"></i>
                                                    </NavLink>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="table-responsive">
                                            <table className="table border-0 star-student table-hover table-center mb-0 datatable table-striped">
                                                <thead className="student-thread">
                                                    <tr>
                                                        <th>Ordinal</th>
                                                        <th>Title</th>
                                                        <th className="text-end">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentQuestions.map((item, index) => {
                                                        return (
                                                            <tr>
                                                                <td>{index + 1}</td>
                                                                <td>
                                                                    {" "}
                                                                    <p
                                                                        key={index}
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: item.title,
                                                                        }}
                                                                    ></p>
                                                                </td>
                                                                <td className="text-end">
                                                                    <div className="actions">
                                                                        <NavLink onClick={() => handleDeleteQuestion(item.id)} className="btn btn-sm bg-danger-light">
                                                                            <i className="feather-trash"></i>
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
                            <div className="col">
                                <ul className="pagination mb-4">
                                    <li className="page-item">
                                        <button className="page-link" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                                            Previous
                                        </button>
                                    </li>

                                    {Array.from(
                                        {
                                            length: Math.ceil(questions.length / questionsPerPage),
                                        },
                                        (_, i) => (
                                            <li key={i} className={`page-item ${i + 1 === currentPage ? "active" : ""}`}>
                                                <button className="page-link" onClick={() => paginate(i + 1)}>
                                                    {i + 1}
                                                </button>
                                            </li>
                                        )
                                    )}
                                    <li className="page-item">
                                        <button className="page-link" onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(questions.length / questionsPerPage)}>
                                            Next
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </Layout>
                </>
            )}
        </>
    );
}
export default Question_List_Essay;
