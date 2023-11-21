import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Loading from "../../layouts/loading";
import { useEffect, useState } from "react";

function NotFound() {
    const [userRole, setUserRole] = useState(null);
    const [homePath, setHomePath] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    const getHomePath = async () => {
        const token = localStorage.getItem("accessToken");
        try {
            const decodedToken = JSON.parse(atob(token.split(".")[1]));
            const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            setUserRole(userRole);

            if (userRole === "Staff") {
                setHomePath("/exam-list");
            } else if (userRole === "Teacher") {
                setHomePath("/teacher-dashboard");
            } else {
                setHomePath("/");
            }
        } catch (error) {
            console.error("Error loading user role:", error);
        }
    };

    useEffect(() => {
        getHomePath();
    }, []);

    return (
        <>
            {loading ? <Loading /> : ""}
            <Helmet>
                <title>Not Found | Examonimy</title>
            </Helmet>
            <div className="error-page" style={{ height: "100vh" }}>
                <div className="main-wrapper">
                    <div className="error-box">
                        <h1>404</h1>
                        <h3 className="h2 mb-3">
                            <i className="fas fa-exclamation-triangle"></i> Oops! Page not found!
                        </h3>
                        <p className="h4 font-weight-normal">The page you requested was not found.</p>
                        {homePath && (
                            <Link to={homePath} className="btn btn-primary">
                                Back to Home
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default NotFound;
