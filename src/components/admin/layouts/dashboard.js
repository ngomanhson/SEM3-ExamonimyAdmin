import { Route, Routes } from "react-router-dom";
import Header_Admin from "./header";
import Sidebar_Admin from "./sidebar";
import Admin_Dashboard from "../pages/admindashboard";
function Dashboard(){
    return(
        <div class="main-wrapper"> 
                <Header_Admin></Header_Admin>
                <Sidebar_Admin></Sidebar_Admin>
                <div class="page-wrapper">
				<div class="content container-fluid">
                <Routes>
                    <Route path='/' element={<Admin_Dashboard/>}></Route>
                </Routes>
                </div>
                <footer>
					<p>Copyright © 2022 Dreamguys.</p>
				</footer>
                </div>
        </div>
    )
}
export default Dashboard;