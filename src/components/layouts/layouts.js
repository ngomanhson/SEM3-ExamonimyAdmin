import Header from "./header";
import Sidebar from "./sidebar";

function Layout({ children }) {
    return (
        <>
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <Header></Header>
                        <Sidebar></Sidebar>
                        <div>{children}</div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Layout;
