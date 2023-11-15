import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Loading from "../../layouts/loading";
import { useEffect } from "react";
import { useState } from "react";

function NotFound() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    });
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
                        <Link to="/" className="btn btn-primary">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NotFound;
