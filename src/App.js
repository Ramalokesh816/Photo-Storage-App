
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";



import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Upload from "./pages/Upload";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

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

</Routes>

</Router>

);

}

export default App;