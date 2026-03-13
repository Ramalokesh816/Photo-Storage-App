import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Gallery.css";

function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState("All");
  const [loading, setLoading] = useState(true);

  const [zoom, setZoom] = useState(1);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const lastTap = useRef(0); // Using ref for more reliable double-tap timing

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://photo-storage-app.onrender.com/api/photos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPhotos(data);
    } catch {
      toast.error("Failed to load gallery");
    }
    setLoading(false);
  };

  /* ================= DELETE ================= */
  const deletePhoto = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`https://photo-storage-app.onrender.com/api/photos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setPhotos((prev) => prev.filter((p) => p._id !== id));
      toast.success("Photo deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const filteredPhotos =
    selectedAlbum === "All"
      ? photos
      : photos.filter((p) => p.album?.toLowerCase() === selectedAlbum.toLowerCase());

  /* ================= NAVIGATION ================= */
  const openMedia = (url, type, index) => {
    setSelectedMedia(url);
    setSelectedType(type);
    setSelectedIndex(index);
    setZoom(1);
  };

  const updateMedia = (newIndex) => {
    const item = filteredPhotos[newIndex];
    setSelectedIndex(newIndex);
    setSelectedMedia(item.imageUrl);
    setSelectedType(item.mediaType);
    setZoom(1); // Reset zoom on slide change
  };

  const nextMedia = (e) => {
    e?.stopPropagation();
    const nextIndex = (selectedIndex + 1) % filteredPhotos.length;
    updateMedia(nextIndex);
  };

  const prevMedia = (e) => {
    e?.stopPropagation();
    const prevIndex = (selectedIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    updateMedia(prevIndex);
  };

  /* ================= ZOOM & TOUCH ================= */
  const handleZoomWheel = (e) => {
    if (selectedType !== "image") return;
    if (e.deltaY < 0) setZoom((prev) => Math.min(prev + 0.3, 3));
    else setZoom((prev) => Math.max(prev - 0.3, 1));
  };

  const toggleZoom = () => {
    if (selectedType !== "image") return;
    setZoom((prev) => (prev === 1 ? 2.5 : 1));
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
    
    // Double Tap Logic
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      e.preventDefault(); // Prevent native browser zoom
      toggleZoom();
    }
    lastTap.current = now;
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) nextMedia();
    if (distance < -minSwipeDistance) prevMedia();

    setTouchStart(null);
    setTouchEnd(null);
  };

  /* ================= MODAL SCROLL LOCK ================= */
  useEffect(() => {
    document.body.style.overflow = selectedMedia ? "hidden" : "auto";
  }, [selectedMedia]);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="loading"><h2>Loading gallery...</h2></div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="gallery-page">
      <Header />
      <div className="gallery">
        <h2>Your Photo Gallery</h2>
        <select
          className="album-filter"
          value={selectedAlbum}
          onChange={(e) => setSelectedAlbum(e.target.value)}
        >
          <option value="All">All</option>
          <option value="General">General</option>
          <option value="Vacation">Vacation</option>
          <option value="Family">Family</option>
          <option value="Friends">Friends</option>
          <option value="Work">Work</option>
        </select>

        <div className="gallery-grid">
          {filteredPhotos.map((photo, index) => (
            <div className="photo-card" key={photo._id}>
              {photo.mediaType === "video" ? (
                <div className="video-thumb-container" onClick={() => openMedia(photo.imageUrl, "video", index)}>
                   <video className="media-item" muted preload="metadata">
                    <source src={`${photo.imageUrl}#t=0.1`} />
                  </video>
                  <div className="play-overlay">▶</div>
                </div>
              ) : (
                <img
                  className="media-item"
                  src={photo.imageUrl}
                  alt="gallery"
                  onClick={() => openMedia(photo.imageUrl, "image", index)}
                />
              )}
              <button className="delete-btn" onClick={() => deletePhoto(photo._id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {selectedMedia && (
        <div
          className="modal"
          onClick={() => setSelectedMedia(null)}
          onWheel={handleZoomWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button className="close-modal" onClick={() => setSelectedMedia(null)}>✕</button>
          <button className="arrow left" onClick={prevMedia}>❮</button>

          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {selectedType === "video" ? (
              <video
                key={selectedMedia} // Vital: forces video to reload when index changes
                controls
                playsInline
                autoPlay
                className="modal-video"
              >
                <source src={selectedMedia} type="video/mp4" />
              </video>
            ) : (
              <img
                src={selectedMedia}
                alt="large"
                className="modal-image"
                style={{ transform: `scale(${zoom})` }}
              />
            )}
          </div>

          <button className="arrow right" onClick={nextMedia}>❯</button>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Gallery;