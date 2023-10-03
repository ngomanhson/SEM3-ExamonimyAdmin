import { Route, Routes } from 'react-router-dom';
import Dashboard from './components/layouts/admin/dashboard';

function App() {
    return (
        <div className="App">
            <Routes>
                {/* <Route element={<HomeLayout />}> */}
                {/* <Route path="/" element={<HomeStudent />} /> */}
                {/* </Route> */}

                <Route path="/dashboard" element={<Dashboard />}>
                </Route>
            </Routes>
        </div>
    );
}

export default App;
