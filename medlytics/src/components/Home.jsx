import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TypingText from "./TypingText"; // Import the TypingText component

const Home = () => {
  // Carousel settings
  const settings = {
    dots: true, // Show dots for navigation
    infinite: true, // Infinite loop
    speed: 600, // Transition speed
    slidesToShow: 1, // Number of slides to show at once
    slidesToScroll: 1, // Number of slides to scroll
    autoplay: true, // Auto-play the carousel
    autoplaySpeed: 3000, // Auto-play speed in milliseconds
    arrows: false, // Hide navigation arrows
  };

  return (
    <div className="container mt-5 ">
      {/* Carousel Section */}
      <div style={{ position: "relative" }}>
        <Slider {...settings} className="mb-5">
          {/* Slide 1 */}
          <div>
            <img
              src="https://res.cloudinary.com/dmilgqv8u/image/upload/v1742818759/sleep_rig5bj.jpg"
              alt="Slide 1"
              className="carousel-image" // Add a class for custom CSS
            />
          </div>

          {/* Slide 2 */}
          <div>
            <img
              src="https://res.cloudinary.com/dmilgqv8u/image/upload/v1742818725/Doctor_ixnlix.jpg"
              alt="Slide 2"
              className="carousel-image" // Add a class for custom CSS
            />
          </div>

          {/* Slide 3 */}
          <div>
            <img
              src="https://res.cloudinary.com/dmilgqv8u/image/upload/v1742818739/nutration_qaszvp.jpg"
              alt="Slide 3"
              className="carousel-image" // Add a class for custom CSS
            />
          </div>

          {/* Slide 4 */}
          <div>
            <img
              src="https://res.cloudinary.com/dmilgqv8u/image/upload/v1742818750/food2_oskiwj.jpg"
              alt="Slide 4"
              className="carousel-image" // Add a class for custom CSS
            />
          </div>

          {/* Slide 5 */}
          <div>
            <img
              src="https://res.cloudinary.com/dmilgqv8u/image/upload/v1742818737/food_f8azyx.jpg"
              alt="Slide 5"
              className="carousel-image" // Add a class for custom CSS
            />
          </div>

          {/* Slide 6 */}
          <div>
            <img
              src="https://res.cloudinary.com/dmilgqv8u/image/upload/v1742818754/stress_i1ealz.jpg"
              alt="Slide 6"
              className="carousel-image" // Add a class for custom CSS
            />
          </div>
        </Slider>

        {/* Typing Text Animation */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "#fff",
            zIndex: 1,
          }}
        >
          <TypingText />
        </div>
      </div>

      {/* Jumbotron Section */}
      <div className="jumbotron text-center">
        <h1 className="display-4">Welcome to Medlytics</h1>
        <p className="lead">Empowering Health Choices for a Vibrant Life</p>
        <hr className="my-4" />
        <p>Your Trusted Partner in Health and Wellness</p>
        <a className="btn btn-primary btn-lg" href="/services" role="button">
          Learn more
        </a>
      </div>
    </div>
  );
};

export default Home;