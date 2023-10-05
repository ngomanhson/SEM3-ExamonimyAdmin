function Blog_List() {
    return (
        <>
            <div className="row">
                <div className="col-md-9">
                    <ul className="list-links mb-4">
                        <li className="active">
                            <a href="blog.html">Active Blog</a>
                        </li>
                        <li>
                            <a href="pending-blog.html">Pending Blog</a>
                        </li>
                    </ul>
                </div>
                <div className="col-md-3 text-md-end">
                    <a
                        href="add-blog.html"
                        className="btn btn-primary btn-blog mb-3"
                    >
                        <i className="feather-plus-circle me-1"></i> Add New
                    </a>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 col-xl-4 col-sm-12 d-flex">
                    <div className="blog grid-blog flex-fill">
                        <div className="blog-image">
                            <a href="blog-details.html">
                                <img
                                    className="img-fluid"
                                    src="assets/img/category/blog-6.jpg"
                                    alt="Post Image"
                                />
                            </a>
                            <div className="blog-views">
                                <i className="feather-eye me-1"></i> 225
                            </div>
                        </div>
                        <div className="blog-content">
                            <ul className="entry-meta meta-item">
                                <li>
                                    <div className="post-author">
                                        <a href="profile.html">
                                            <img
                                                src="assets/img/profiles/avatar-01.jpg"
                                                alt="Post Author"
                                            />
                                            <span>
                                                <span className="post-title">
                                                    Vincent
                                                </span>
                                                <span className="post-date">
                                                    <i className="far fa-clock"></i>{" "}
                                                    4 Dec 2022
                                                </span>
                                            </span>
                                        </a>
                                    </div>
                                </li>
                            </ul>
                            <h3 className="blog-title">
                                <a href="blog-details.html">
                                    Learning is an objective, Lorem Ipsum is not{" "}
                                </a>
                            </h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur em
                                adipiscing elit, sed do eiusmod tempor.
                            </p>
                        </div>
                        <div className="row">
                            <div className="edit-options">
                                <div className="edit-delete-btn">
                                    <a
                                        href="edit-blog.html"
                                        className="text-success"
                                    >
                                        <i className="feather-edit-3 me-1"></i>{" "}
                                        Edit
                                    </a>
                                    <a
                                        href="#"
                                        className="text-danger"
                                        data-bs-toggle="modal"
                                        data-bs-target="#deleteModal"
                                    >
                                        <i className="feather-trash-2 me-1"></i>{" "}
                                        Delete
                                    </a>
                                </div>
                                <div className="text-end inactive-style">
                                    <a
                                        href="javascript:void(0);"
                                        className="text-danger"
                                        data-bs-toggle="modal"
                                        data-bs-target="#deleteNotConfirmModal"
                                    >
                                        <i className="feather-eye-off me-1"></i>{" "}
                                        Inactive
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-xl-4 col-sm-12 d-flex">
                    <div className="blog grid-blog flex-fill">
                        <div className="blog-image">
                            <a href="blog-details.html">
                                <img
                                    className="img-fluid"
                                    src="assets/img/category/blog-2.jpg"
                                    alt="Post Image"
                                />
                            </a>
                            <div className="blog-views">
                                <i className="feather-eye me-1"></i> 132
                            </div>
                        </div>
                        <div className="blog-content">
                            <ul className="entry-meta meta-item">
                                <li>
                                    <div className="post-author">
                                        <a href="profile.html">
                                            <img
                                                src="assets/img/profiles/avatar-02.jpg"
                                                alt="Post Author"
                                            />
                                            <span>
                                                <span className="post-title">
                                                    Lois A
                                                </span>
                                                <span className="post-date">
                                                    <i className="far fa-clock"></i>{" "}
                                                    4 Dec 2022
                                                </span>
                                            </span>
                                        </a>
                                    </div>
                                </li>
                            </ul>
                            <h3 className="blog-title">
                                <a href="blog-details.html">
                                    Discussion Increase student learning
                                </a>
                            </h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur em
                                adipiscing elit, sed do eiusmod tempor.
                            </p>
                        </div>
                        <div className="row">
                            <div className="edit-options">
                                <div className="edit-delete-btn">
                                    <a
                                        href="edit-blog.html"
                                        className="text-success"
                                    >
                                        <i className="feather-edit-3 me-1"></i>{" "}
                                        Edit
                                    </a>
                                </div>
                                <div className="text-end inactive-style">
                                    <a
                                        href="javascript:void(0);"
                                        className="text-danger"
                                        data-bs-toggle="modal"
                                        data-bs-target="#deleteNotConfirmModal"
                                    >
                                        <i className="feather-eye-off me-1"></i>{" "}
                                        Inactive
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-xl-4 col-sm-12 d-flex">
                    <div className="blog grid-blog flex-fill">
                        <div className="blog-image">
                            <a href="blog-details.html">
                                <img
                                    className="img-fluid"
                                    src="assets/img/category/blog-3.jpg"
                                    alt="Post Image"
                                />
                            </a>
                            <div className="blog-views">
                                <i className="feather-eye me-1"></i> 344
                            </div>
                        </div>
                        <div className="blog-content">
                            <ul className="entry-meta meta-item">
                                <li>
                                    <div className="post-author">
                                        <a href="profile.html">
                                            <img
                                                src="assets/img/profiles/avatar-03.jpg"
                                                alt="Post Author"
                                            />
                                            <span>
                                                <span className="post-title">
                                                    Levell Scott
                                                </span>
                                                <span className="post-date">
                                                    <i className="far fa-clock"></i>{" "}
                                                    4 Dec 2022
                                                </span>
                                            </span>
                                        </a>
                                    </div>
                                </li>
                            </ul>
                            <h3 className="blog-title">
                                <a href="blog-details.html">
                                    Music reduces stress,Lorem Ipsum is not{" "}
                                </a>
                            </h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur em
                                adipiscing elit, sed do eiusmod tempor.
                            </p>
                        </div>
                        <div className="row">
                            <div className="edit-options">
                                <div className="edit-delete-btn">
                                    <a
                                        href="edit-blog.html"
                                        className="text-success"
                                    >
                                        <i className="feather-edit-3 me-1"></i>{" "}
                                        Edit
                                    </a>
                                </div>
                                <div className="text-end inactive-style">
                                    <a
                                        href="javascript:void(0);"
                                        className="text-danger"
                                        data-bs-toggle="modal"
                                        data-bs-target="#deleteNotConfirmModal"
                                    >
                                        <i className="feather-eye-off me-1"></i>{" "}
                                        Inactive
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-xl-4 col-sm-12 d-flex">
                    <div className="blog grid-blog flex-fill">
                        <div className="blog-image">
                            <a href="blog-details.html">
                                <img
                                    className="img-fluid"
                                    src="assets/img/category/blog-4.jpg"
                                    alt="Post Image"
                                />
                            </a>
                            <div className="blog-views">
                                <i className="feather-eye me-1"></i> 215
                            </div>
                        </div>
                        <div className="blog-content">
                            <ul className="entry-meta meta-item">
                                <li>
                                    <div className="post-author">
                                        <a href="profile.html">
                                            <img
                                                src="assets/img/profiles/avatar-04.jpg"
                                                alt="Post Author"
                                            />
                                            <span>
                                                <span className="post-title">
                                                    Calvin
                                                </span>
                                                <span className="post-date">
                                                    <i className="far fa-clock"></i>{" "}
                                                    4 Dec 2022
                                                </span>
                                            </span>
                                        </a>
                                    </div>
                                </li>
                            </ul>
                            <h3 className="blog-title">
                                <a href="blog-details.html">
                                    Sports reduced risk of obesity, Lorem Ipsum
                                    is not{" "}
                                </a>
                            </h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur em
                                adipiscing elit, sed do eiusmod tempor.
                            </p>
                        </div>
                        <div className="row">
                            <div className="edit-options">
                                <div className="edit-delete-btn">
                                    <a
                                        href="edit-blog.html"
                                        className="text-success"
                                    >
                                        <i className="feather-edit-3 me-1"></i>{" "}
                                        Edit
                                    </a>
                                </div>
                                <div className="text-end inactive-style">
                                    <a
                                        href="javascript:void(0);"
                                        className="text-danger"
                                        data-bs-toggle="modal"
                                        data-bs-target="#deleteNotConfirmModal"
                                    >
                                        <i className="feather-eye-off me-1"></i>{" "}
                                        Inactive
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-xl-4 col-sm-12 d-flex">
                    <div className="blog grid-blog flex-fill">
                        <div className="blog-image">
                            <a href="blog-details.html">
                                <img
                                    className="img-fluid"
                                    src="assets/img/category/blog-5.jpg"
                                    alt="Post Image"
                                />
                            </a>
                            <div className="blog-views">
                                <i className="feather-eye me-1"></i> 285
                            </div>
                        </div>
                        <div className="blog-content">
                            <ul className="entry-meta meta-item">
                                <li>
                                    <div className="post-author">
                                        <a href="profile.html">
                                            <img
                                                src="assets/img/profiles/avatar-05.jpg"
                                                alt="Post Author"
                                            />
                                            <span>
                                                <span className="post-title">
                                                    Aaliyah{" "}
                                                </span>
                                                <span className="post-date">
                                                    <i className="far fa-clock"></i>{" "}
                                                    4 Dec 2022
                                                </span>
                                            </span>
                                        </a>
                                    </div>
                                </li>
                            </ul>
                            <h3 className="blog-title">
                                <a href="blog-details.html">
                                    Yoga can ease arthritis symptoms
                                </a>
                            </h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur em
                                adipiscing elit, sed do eiusmod tempor.
                            </p>
                        </div>
                        <div className="row">
                            <div className="edit-options">
                                <div className="edit-delete-btn">
                                    <a
                                        href="edit-blog.html"
                                        className="text-success"
                                    >
                                        <i className="feather-edit-3 me-1"></i>{" "}
                                        Edit
                                    </a>
                                </div>
                                <div className="text-end inactive-style">
                                    <a
                                        href="javascript:void(0);"
                                        className="text-danger"
                                        data-bs-toggle="modal"
                                        data-bs-target="#deleteNotConfirmModal"
                                    >
                                        <i className="feather-eye-off me-1"></i>{" "}
                                        Inactive
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-xl-4 col-sm-12 d-flex">
                    <div className="blog grid-blog flex-fill">
                        <div className="blog-image">
                            <a href="blog-details.html">
                                <img
                                    className="img-fluid"
                                    src="assets/img/category/blog-1.jpg"
                                    alt="Post Image"
                                />
                            </a>
                            <div className="blog-views">
                                <i className="feather-eye me-1"></i> 654
                            </div>
                        </div>
                        <div className="blog-content">
                            <ul className="entry-meta meta-item">
                                <li>
                                    <div className="post-author">
                                        <a href="profile.html">
                                            <img
                                                src="assets/img/profiles/avatar-06.jpg"
                                                alt="Post Author"
                                            />
                                            <span>
                                                <span className="post-title">
                                                    Malynne
                                                </span>
                                                <span className="post-date">
                                                    <i className="far fa-clock"></i>{" "}
                                                    4 Dec 2022
                                                </span>
                                            </span>
                                        </a>
                                    </div>
                                </li>
                            </ul>
                            <h3 className="blog-title">
                                <a href="blog-details.html">
                                    Education gives Greater Sense of Disciplinet
                                </a>
                            </h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur em
                                adipiscing elit, sed do eiusmod tempor.
                            </p>
                        </div>
                        <div className="row">
                            <div className="edit-options">
                                <div className="edit-delete-btn">
                                    <a
                                        href="edit-blog.html"
                                        className="text-success"
                                    >
                                        <i className="feather-edit-3 me-1"></i>{" "}
                                        Edit
                                    </a>
                                    <a
                                        href="edit-blog.html"
                                        className="text-danger"
                                        data-bs-toggle="modal"
                                        data-bs-target="#deleteModal"
                                    >
                                        <i className="feather-trash-2 me-1"></i>{" "}
                                        Delete
                                    </a>
                                </div>
                                <div className="text-end inactive-style">
                                    <a
                                        href="javascript:void(0);"
                                        className="text-danger"
                                        data-bs-toggle="modal"
                                        data-bs-target="#deleteNotConfirmModal"
                                    >
                                        <i className="feather-eye-off me-1"></i>{" "}
                                        Inactive
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-12">
                    <div className="pagination-tab d-flex justify-content-center">
                        <ul className="pagination mb-0">
                            <li className="page-item disabled">
                                <a className="page-link" href="#" tabindex="-1">
                                    <i className="feather-chevron-left mr-2"></i>
                                    Previous
                                </a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" href="#">
                                    1
                                </a>
                            </li>
                            <li className="page-item active">
                                <a className="page-link" href="#">
                                    2 <span className="sr-only">(current)</span>
                                </a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" href="#">
                                    3
                                </a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" href="#">
                                    4
                                </a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" href="#">
                                    Next
                                    <i className="feather-chevron-right ml-2"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div
                className="modal fade contentmodal"
                id="deleteModal"
                tabindex="-1"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content doctor-profile">
                        <div className="modal-header pb-0 border-bottom-0 justify-content-end">
                            <button
                                type="button"
                                className="close-btn"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <i className="feather-x-circle"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="delete-wrap text-center">
                                <div className="del-icon">
                                    <i className="feather-x-circle"></i>
                                </div>
                                <h2>Sure you want to delete</h2>
                                <div className="submit-section">
                                    <a
                                        href="blog.html"
                                        className="btn btn-success me-2"
                                    >
                                        Yes
                                    </a>
                                    <a
                                        href="#"
                                        className="btn btn-danger"
                                        data-bs-dismiss="modal"
                                    >
                                        No
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Blog_List;
