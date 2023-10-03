import Header_Admin from "./header";
import Sidebar_Admin from "./sidebar";
function Dashboard(){
    return(
        <div class="main-wrapper"> 
                <Header_Admin></Header_Admin>
                <Sidebar_Admin></Sidebar_Admin>
        </div>
    )
}
export default Dashboard;