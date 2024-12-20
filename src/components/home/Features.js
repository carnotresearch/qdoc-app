import React, { useState, useEffect } from "react";

function Features() {
  const carouselItems = [
    {
      type: "image",
      content: (
        <img
          src="./features.jpg"
          alt="Feature"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      ),
    },
    {
      type: "iframe",
      content: (
        <iframe
          src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7267918084563218432"
          style={{ width: "100%", height: "100%", border: "none" }}
          allowFullScreen
          title="LinkedIn Post"
        ></iframe>
      ),
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
      );
    }, 100000000);

    return () => clearTimeout(timer);
  }, [currentIndex, carouselItems.length]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
  };

  const containerStyle = {
    width: "100%",
    height: "87.5vh",
    overflow: "hidden",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const buttonStyle = {
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

  const prevButtonStyle = { ...buttonStyle, left: "20px" };
  const nextButtonStyle = { ...buttonStyle, right: "20px" };

  return (
    <div style={containerStyle}>
      <button style={prevButtonStyle} onClick={handlePrev}>
        &#8249;
      </button>
      <div style={{ width: "100%", height: "100%" }}>{carouselItems[currentIndex].content}</div>
      <button style={nextButtonStyle} onClick={handleNext}>
        &#8250;
      </button>
    </div>
  );
}

export default Features;
