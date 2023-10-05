function Blog_Create() {
    return (
        <>
            <div className="row">
                <div className="col-xl-12">
                    <div className="page-header">
                        <div className="row">
                            <div className="col-sm-12">
                                <h3 className="page-title">Add Post</h3>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body">
                            <div className="bank-inner-details">
                                <div className="row">
                                    <div className="col-lg-12 col-md-12">
                                        <div className="form-group">
                                            <label>
                                                Title
                                                <span className="text-danger">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12">
                                        <div className="form-group">
                                            <label>Blog Image</label>
                                            <div className="change-photo-btn">
                                                <div>
                                                    <p>Add Image</p>
                                                </div>
                                                <input
                                                    type="file"
                                                    className="upload"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12">
                                        <div className="form-group">
                                            <label>Description</label>
                                            <div id="editor"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="blog-categories-btn pt-0">
                            <div className="bank-details-btn">
                                <a
                                    href="blog.html"
                                    className="btn bank-cancel-btn me-2"
                                >
                                    Add Post
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Blog_Create;
