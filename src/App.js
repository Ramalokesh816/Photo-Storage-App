import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Upload from "./pages/Upload";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";

function App(){

return(

<Router>

<Routes>

<Route path="/" element={<Home/>} />
<Route path="/login" element={<Login/>} />
<Route path="/register" element={<Register/>} />

<Route
path="/gallery"
element={
<ProtectedRoute>
<Gallery/>
</ProtectedRoute>
}
/>

<Route
path="/upload"
element={
<ProtectedRoute>
<Upload/>
</ProtectedRoute>
}
/>

<Route
path="/profile"
element={
<ProtectedRoute>
<Profile/>
</ProtectedRoute>
}
/>

<Route path="/dashboard" element={<Dashboard/>}/>

</Routes>

<ToastContainer
position="top-right"
autoClose={3000}
hideProgressBar={false}
closeOnClick
pauseOnHover
theme="colored"
/>

</Router>

);

}

export default App;