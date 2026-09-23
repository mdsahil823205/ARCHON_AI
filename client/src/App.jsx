
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from './pages/Home'
import UseGetCurrentUser from './hooks/UseGetCurrentUser'
import DashBoard from './pages/DashBoard'
import Generate from './pages/Generate'
import { useSelector } from 'react-redux'

import EditorPage from "./pages/editor/EditorPage"
import LiveSite from "./pages/LiveSite"
import Pricing from "./pages/Pricing"

export const serverUrl = 'http://localhost:3000'

function App() {
    const { userData } = useSelector((state) => state.userDetails);
    UseGetCurrentUser()
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/dashboard' element={userData ? <DashBoard /> : <Home />} />
                <Route path='/generate' element={userData ? <Generate /> : <Home />} />
                <Route path='/editor/:id' element={userData ? <EditorPage /> : <Home />} />
                <Route path="/site/:slug" element={<LiveSite />} />
                <Route path="/pricing" element={<Pricing />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App