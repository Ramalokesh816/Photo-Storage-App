import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Dashboard.css";

import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer
} from "recharts";

function Dashboard(){

const [data,setData] = useState({
totalPhotos:0,
totalVideos:0,
albums:0,
storageUsed:0,
recentUploads:[],
monthlyUploads:[]
});

useEffect(()=>{
fetchDashboard();
},[]);

const fetchDashboard = async ()=>{

try{

const token = localStorage.getItem("token");

const res = await fetch("https://photo-storage-app.onrender.com/api/dashboard",{
headers:{
Authorization:`Bearer ${token}`
}
});

const result = await res.json();

setData(result);

}catch(error){
console.log(error);
}

};

const storageLimit = 25600; // 25GB
const storagePercent = (data.storageUsed / storageLimit) * 100;

return(

<div>

<Header/>

<div className="dashboard-container">

<h1>Your Dashboard</h1>

{/* STATISTICS */}

<div className="stats">

<div className="stat-card">
<h3>Total Photos</h3>
<p>{data.totalPhotos}</p>
</div>

<div className="stat-card">
<h3>Total Videos</h3>
<p>{data.totalVideos}</p>
</div>

<div className="stat-card">
<h3>Albums</h3>
<p>{data.albums}</p>
</div>

<div className="stat-card">
<h3>Storage Used</h3>
<p>{data.storageUsed} MB</p>
</div>

</div>

{/* STORAGE BAR */}

<div className="storage-box">

<h2>Storage Usage</h2>

<div className="progress-bar">

<div
className="progress-fill"
style={{width:`${storagePercent}%`}}
></div>

</div>

<p>{data.storageUsed} MB / 25600 MB</p>

</div>

{/* MONTHLY CHART */}

<div className="chart-box">

<h2>Monthly Uploads</h2>

<ResponsiveContainer width="100%" height={300}>

<BarChart data={data.monthlyUploads}>

<XAxis dataKey="month"/>

<YAxis/>

<Tooltip/>

<Bar dataKey="uploads" fill="#6366f1"/>

</BarChart>

</ResponsiveContainer>

</div>

{/* RECENT UPLOADS */}

<h2>Recent Uploads</h2>

<div className="recent-grid">

{data.recentUploads.length === 0 ?(

<p>No recent uploads</p>

):(

data.recentUploads.map(media=>(
<div key={media._id} className="media-card">

{media.mediaType==="video"?(
<video controls>
<source src={media.imageUrl}/>
</video>
):(
<img src={media.imageUrl} alt="media"/>
)}

</div>
))

)}

</div>

</div>

<Footer/>

</div>

);

}

export default Dashboard;