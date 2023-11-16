import { NavLink, useLocation } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import api from "../services/api";
import url from "../services/url";
function Sidebar() {
    const slimScrollRef = useRef(null);
    const [menu, setMenu] = useState([]);
    const location = useLocation();
    useEffect(() => {
        const fetchMenu = async () => {
            const adminToken = localStorage.getItem("accessToken");
            try {
                const response = await api.get(url.MENU.LIST, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${adminToken}`,
                    },
                });
                // const data = response.data;
                setMenu(response.data);
            } catch (error) {
                console.error("Error fetching menu:", error);
            }
        };
        fetchMenu();
    }, []);

    return (
        <>
            <div className="row">
                <div className="sidebar" id="sidebar">
                    <div className="sidebar-inner slimscroll" ref={slimScrollRef}>
                        <div id="sidebar-menu" className="sidebar-menu">
                            <ul>
                                <li className="menu-title">
                                    <span>Main Menu</span>
                                </li>
                                {menu.map((menuItem, index) => (
                                    <li className={`submenu ${location.pathname === menuItem.url ? "active" : ""}`} key={index}>
                                        <NavLink to={menuItem.url}>
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: menuItem.icon,
                                                }}
                                            ></span>
                                            <span>{menuItem.title}</span>
                                            <span className="menu-arrow"></span>
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
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
        </>
    );
}
export default Sidebar;
