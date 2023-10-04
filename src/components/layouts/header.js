function Header() {
    return (
        <>
            <div className="row">
                <div className="header">
                    <div className="header-left">
                        <a href="index.html" className="logo">
                            <img src="assets/img/logo.png" alt="Logo" />
                        </a>
                        <a href="index.html" className="logo logo-small">
                            <img
                                src="assets/img/logo-small.png"
                                alt="Logo"
                                width="30"
                                height="30"
                            />
                        </a>
                    </div>

                    <div className="menu-toggle">
                        <a href="javascript:void(0);" id="toggle_btn">
                            <i className="fas fa-bars"></i>
                        </a>
                    </div>

                    <div className="top-nav-search">
                        <form>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search here"
                            />
                            <button className="btn" type="submit">
                                <i className="fas fa-search"></i>
                            </button>
                        </form>
                    </div>

                    <a className="mobile_btn" id="mobile_btn">
                        <i className="fas fa-bars"></i>
                    </a>

                    <ul className="nav user-menu">
                        <li className="nav-item dropdown noti-dropdown language-drop me-2">
                            <a
                                href="#"
                                className="dropdown-toggle nav-link header-nav-list"
                                data-bs-toggle="dropdown"
                            >
                                <img
                                    src="assets/img/icons/header-icon-01.svg"
                                    alt
                                />
                            </a>
                            <div className="dropdown-menu">
                                <div className="noti-content">
                                    <div>
                                        <a
                                            className="dropdown-item"
                                            href="javascript:;"
                                        >
                                            <i className="flag flag-lr me-2"></i>
                                            English
                                        </a>
                                        <a
                                            className="dropdown-item"
                                            href="javascript:;"
                                        >
                                            <i className="flag flag-bl me-2"></i>
                                            Francais
                                        </a>
                                        <a
                                            className="dropdown-item"
                                            href="javascript:;"
                                        >
                                            <i className="flag flag-cn me-2"></i>
                                            Turkce
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </li>

                        <li className="nav-item dropdown noti-dropdown me-2">
                            <a
                                href="#"
                                className="dropdown-toggle nav-link header-nav-list"
                                data-bs-toggle="dropdown"
                            >
                                <img
                                    src="assets/img/icons/header-icon-05.svg"
                                    alt
                                />
                            </a>
                            <div className="dropdown-menu notifications">
                                <div className="topnav-dropdown-header">
                                    <span className="notification-title">
                                        Notifications
                                    </span>
                                    <a
                                        href="javascript:void(0)"
                                        className="clear-noti"
                                    >
                                        {" "}
                                        Clear All{" "}
                                    </a>
                                </div>
                                <div className="noti-content">
                                    <ul className="notification-list">
                                        <li className="notification-message">
                                            <a href="#">
                                                <div className="media d-flex">
                                                    <span className="avatar avatar-sm flex-shrink-0">
                                                        <img
                                                            className="avatar-img rounded-circle"
                                                            alt="User Image"
                                                            src="assets/img/profiles/avatar-02.jpg"
                                                        />
                                                    </span>
                                                    <div className="media-body flex-grow-1">
                                                        <p className="noti-details">
                                                            <span className="noti-title">
                                                                Carlson Tech
                                                            </span>{" "}
                                                            has approved{" "}
                                                            <span className="noti-title">
                                                                your estimate
                                                            </span>
                                                        </p>
                                                        <p className="noti-time">
                                                            <span className="notification-time">
                                                                4 mins ago
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                        <li className="notification-message">
                                            <a href="#">
                                                <div className="media d-flex">
                                                    <span className="avatar avatar-sm flex-shrink-0">
                                                        <img
                                                            className="avatar-img rounded-circle"
                                                            alt="User Image"
                                                            src="assets/img/profiles/avatar-11.jpg"
                                                        />
                                                    </span>
                                                    <div className="media-body flex-grow-1">
                                                        <p className="noti-details">
                                                            <span className="noti-title">
                                                                International
                                                                Software Inc
                                                            </span>{" "}
                                                            has sent you a
                                                            invoice in the
                                                            amount of{" "}
                                                            <span className="noti-title">
                                                                $218
                                                            </span>
                                                        </p>
                                                        <p className="noti-time">
                                                            <span className="notification-time">
                                                                6 mins ago
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                        <li className="notification-message">
                                            <a href="#">
                                                <div className="media d-flex">
                                                    <span className="avatar avatar-sm flex-shrink-0">
                                                        <img
                                                            className="avatar-img rounded-circle"
                                                            alt="User Image"
                                                            src="assets/img/profiles/avatar-17.jpg"
                                                        />
                                                    </span>
                                                    <div className="media-body flex-grow-1">
                                                        <p className="noti-details">
                                                            <span className="noti-title">
                                                                John Hendry
                                                            </span>{" "}
                                                            sent a cancellation
                                                            request{" "}
                                                            <span className="noti-title">
                                                                Apple iPhone XR
                                                            </span>
                                                        </p>
                                                        <p className="noti-time">
                                                            <span className="notification-time">
                                                                8 mins ago
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                        <li className="notification-message">
                                            <a href="#">
                                                <div className="media d-flex">
                                                    <span className="avatar avatar-sm flex-shrink-0">
                                                        <img
                                                            className="avatar-img rounded-circle"
                                                            alt="User Image"
                                                            src="assets/img/profiles/avatar-13.jpg"
                                                        />
                                                    </span>
                                                    <div className="media-body flex-grow-1">
                                                        <p className="noti-details">
                                                            <span className="noti-title">
                                                                Mercury Software
                                                                Inc
                                                            </span>{" "}
                                                            added a new product{" "}
                                                            <span className="noti-title">
                                                                Apple MacBook
                                                                Pro
                                                            </span>
                                                        </p>
                                                        <p className="noti-time">
                                                            <span className="notification-time">
                                                                12 mins ago
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="topnav-dropdown-footer">
                                    <a href="#">View all Notifications</a>
                                </div>
                            </div>
                        </li>

                        <li className="nav-item zoom-screen me-2">
                            <a
                                href="#"
                                className="nav-link header-nav-list win-maximize"
                            >
                                <img
                                    src="assets/img/icons/header-icon-04.svg"
                                    alt
                                />
                            </a>
                        </li>

                        <li className="nav-item dropdown has-arrow new-user-menus">
                            <a
                                href="#"
                                className="dropdown-toggle nav-link"
                                data-bs-toggle="dropdown"
                            >
                                <span className="user-img">
                                    <img
                                        className="rounded-circle"
                                        src="assets/img/profiles/avatar-01.jpg"
                                        width="31"
                                        alt="Ryan Taylor"
                                    />
                                    <div className="user-text">
                                        <h6>Ryan Taylor</h6>
                                        <p className="text-muted mb-0">
                                            Administrator
                                        </p>
                                    </div>
                                </span>
                            </a>
                            <div className="dropdown-menu">
                                <div className="user-header">
                                    <div className="avatar avatar-sm">
                                        <img
                                            src="assets/img/profiles/avatar-01.jpg"
                                            alt="User Image"
                                            className="avatar-img rounded-circle"
                                        />
                                    </div>
                                    <div className="user-text">
                                        <h6>Ryan Taylor</h6>
                                        <p className="text-muted mb-0">
                                            Administrator
                                        </p>
                                    </div>
                                </div>
                                <a
                                    className="dropdown-item"
                                    href="profile.html"
                                >
                                    My Profile
                                </a>
                                <a className="dropdown-item" href="inbox.html">
                                    Inbox
                                </a>
                                <a className="dropdown-item" href="login.html">
                                    Logout
                                </a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default Header;
