import { NavLink, useLocation } from "react-router-dom";
import React, { useEffect, useRef } from "react";
import $ from "jquery";

function Sidebar() {
    const slimScrollRef = useRef(null);
    const location = useLocation();

    // scroll
    useEffect(() => {
        if (
            typeof window.$ === "function" &&
            typeof window.$.fn.slimScroll === "function"
        ) {
            if (slimScrollRef.current) {
                window.$(slimScrollRef.current).slimScroll({
                    height: "auto",
                    width: "100%",
                    position: "right",
                    size: "7px",
                    color: "#ccc",
                    allowPageScroll: false,
                    wheelStep: 10,
                    touchScrollStep: 100,
                });
            }
        } else {
            console.error("Error Scroll");
        }
    }, []);

    // //sub menu
    useEffect(() => {
        function handleMenuItemClick(e) {
            const $menuItem = $(e.currentTarget);
            if ($menuItem.next("ul").length > 0) {
                e.preventDefault();
                if (!$menuItem.hasClass("subdrop")) {
                    $("ul", $menuItem.parents("ul:first")).slideUp(350);
                    $("a", $menuItem.parents("ul:first")).removeClass(
                        "subdrop"
                    );
                    $menuItem.next("ul").slideDown(350);
                    $menuItem.addClass("subdrop");
                } else if ($menuItem.hasClass("subdrop")) {
                    $menuItem.removeClass("subdrop");
                    $menuItem.next("ul").slideUp(350);
                }
            }
        }

        const $menuItems = $("#sidebar-menu a");
        let $activeMenuItem = null;
        $menuItems.on("click", handleMenuItemClick);
        $menuItems.each(function () {
            const href = $(this).attr("href");
            if (location.pathname === href) {
                $activeMenuItem = $(this);
            }
        });
        $menuItems
            .not($activeMenuItem)
            .parents("li.submenu")
            .removeClass("active");
        $activeMenuItem &&
            $activeMenuItem.parents("li.submenu").addClass("active");

        return () => {
            $menuItems.off("click", handleMenuItemClick);
        };
    }, [location]);

    return (
        <>
            <div className="row">
                <div className="sidebar" id="sidebar">
                    <div
                        className="sidebar-inner slimscroll"
                        ref={slimScrollRef}
                    >
                        <div id="sidebar-menu" className="sidebar-menu">
                            <ul>
                                <li className="menu-title">
                                    <span>Main Menu</span>
                                </li>
                                <li className="submenu">
                                    <a href="#">
                                        <i className="feather-grid"></i>
                                        <span> Dashboard</span>
                                        <span className="menu-arrow"></span>
                                    </a>
                                    <ul>
                                        <li>
                                            <NavLink to="/">
                                                Admin Dashboard
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/teacher-dashboard">
                                                Teacher Dashboard
                                            </NavLink>
                                        </li>
                                    </ul>
                                </li>
                                <li className="submenu">
                                    <a href="#">
                                        <i className="fas fa-clipboard-list"></i>
                                        <span> Exam</span>
                                        <span className="menu-arrow"></span>
                                    </a>
                                    <ul>
                                        <li>
                                            <NavLink to="/exam-list">
                                                Exam List
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/exam-create">
                                                Exam Add
                                            </NavLink>
                                            <NavLink to="/exam-create-essay">
                                                Exam Add Essay Test
                                            </NavLink>
                                        </li>
                                    </ul>
                                </li>
                                <li className="submenu">
                                    <a href="#">
                                        <i className="fas fa-building"></i>
                                        <span> Classes</span>
                                        <span className="menu-arrow"></span>
                                    </a>
                                    <ul>
                                        <li>
                                            <NavLink to="/classes-list">
                                                Classes List
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/class-create">
                                                Class Add
                                            </NavLink>
                                        </li>
                                    </ul>
                                </li>
                                <li className="submenu">
                                    <a href="#">
                                        <i className="fas fa-book-reader"></i>
                                        <span> Course</span>
                                        <span className="menu-arrow"></span>
                                    </a>
                                    <ul>
                                        <li>
                                            <NavLink to="/course-list">
                                                Course List
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/course-create">
                                                Course Add
                                            </NavLink>
                                        </li>
                                    </ul>
                                </li>
                                <li className="submenu">
                                    <a href="#">
                                        <i className="fas fa-chalkboard-teacher"></i>
                                        <span> Teachers</span>
                                        <span className="menu-arrow"></span>
                                    </a>
                                    <ul>
                                        <li>
                                            <NavLink to="/teacher-list">
                                                Teacher List
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/teacher-create">
                                                Teacher Add
                                            </NavLink>
                                        </li>
                                    </ul>
                                </li>
                                <li className="submenu">
                                    <a href="#">
                                        <i className="fas fa-graduation-cap"></i>
                                        <span> Students</span>
                                        <span className="menu-arrow"></span>
                                    </a>
                                    <ul>
                                        <li>
                                            <NavLink to="/student-list">
                                                Student List
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/student-create">
                                                Student Add
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/student-deleteat">
                                                Student List Delete
                                            </NavLink>
                                        </li>
                                    </ul>
                                </li>
                                <li className="menu-title">
                                    <span>Management</span>
                                </li>
                                <li className="submenu">
                                    <a href="#">
                                        <i className="fa fa-newspaper"></i>
                                        <span> Blogs</span>
                                        <span className="menu-arrow"></span>
                                    </a>
                                    <ul>
                                        <li>
                                            <NavLink to="/blog-list">
                                                All Blogs
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/blog-create">
                                                Add Blog
                                            </NavLink>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <a href="settings.html">
                                        <i className="fas fa-cog"></i>
                                        <span>Settings</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Sidebar;
