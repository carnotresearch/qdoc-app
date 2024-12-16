import React, { useState, useEffect, useRef } from "react";

function Features() {
  const carouselItems = [
    { type: "image", src: "./features.jpg" }, // Picture
    { type: "video", src: "./video1.mp4" }, // Video 1
    { type: "video", src: "./video2.mp4" }, // Video 2
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef(null);

  // Function to go to the next item
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Function to go to the previous item
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
  };

  // Automatically switch after 5 seconds for images or after video ends
  useEffect(() => {
    let timer;

    if (carouselItems[currentIndex].type === "image") {
      timer = setTimeout(handleNext, 5000); // Switch after 5 seconds for images
    } else if (carouselItems[currentIndex].type === "video") {
      const video = videoRef.current;
      if (video) {
        video.play(); // Auto-play video
        video.onended = handleNext; // Move to next slide after video ends
      }
    }

    return () => {
      clearTimeout(timer);
    };
  }, [currentIndex]);

  // Styles
  const containerStyle = {
    width: "100%",
    height: "100vh",
    overflow: "hidden",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF", // Black background
  };

  const mediaStyle = {
    width: "100%",
    height: "100%",
    objectFit: "contain", // Ensures media fills the container
  };

  const navButtonStyle = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(0, 0, 0, 0.7)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    fontSize: "1.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "background 0.3s ease",
    zIndex: 1,
  };

  const prevButtonStyle = { ...navButtonStyle, left: "20px" };
  const nextButtonStyle = { ...navButtonStyle, right: "20px" };

  return (
    <div style={containerStyle}>
      <button style={prevButtonStyle} onClick={handlePrev}>
        &#8249;
      </button>

      {/* Conditional rendering for image or video */}
      {carouselItems[currentIndex].type === "image" ? (
        <img
          src={carouselItems[currentIndex].src}
          alt={`Slide ${currentIndex + 1}`}
          style={mediaStyle}
        />
      ) : (
        <video
          ref={videoRef}
          src={carouselItems[currentIndex].src}
          style={mediaStyle}
          muted
          playsInline
        />
      )}

      <button style={nextButtonStyle} onClick={handleNext}>
        &#8250;
      </button>
    </div>
  );
}

export default Features;
