import { Route, Routes } from "react-router-dom";
import Header from "./components/layouts/header";
import Sidebar from "./components/layouts/sidebar";
import Admin_Dashboard from "./components/pages/admindashboard";
import Teacher_Dashboard from "./components/pages/teacherdashboard";

function App() {
    return (
        <div className="App">
            <div className="main-wrapper">
                <Header></Header>
                <Sidebar></Sidebar>
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <Routes>
                            <Route
                                path="/"
                                element={<Admin_Dashboard />}
                            ></Route>
                            <Route
                                path="/teacher_dashboard"
                                element={<Teacher_Dashboard />}
                            ></Route>
                        </Routes>
                    </div>
                    <footer>
                        <p> Copyright© 2023 T2207A-EXAMONIMY. </p>
                    </footer>
                </div>
            </div>
        </div>
    );
}

export default App;
