import { useState, useEffect } from "react";
import "./ImageSlider.css";

// List of public placeholder image URLs populated in the slider
const images = [
    "https://picsum.photos/id/1015/1000/600",
    "https://picsum.photos/id/1016/1000/600",
    "https://picsum.photos/id/1018/1000/600",
    "https://picsum.photos/id/1020/1000/600",
];

export default function ImageSlider() {
    // State tracking the currently visible image index
    const [currentIndex, setCurrentIndex] = useState(0);

    // Shifts slider to next image (wraps back to 0 on reaching the end)
    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    // Shifts slider to previous image (wraps to last index on reaching 0)
    const prevSlide = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    // Auto-plays slides every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 3000);

        // Cleans up the timer on component unmount to prevent memory leaks
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="slider">
            {/* Wrapper element shifting horizontally based on the active image index */}
            <div
                className="slides"
                style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                }}
            >
                {/* Dynamically renders each slide image */}
                {images.map((image, index) => (
                    <div className="slide" key={index}>
                        <img src={image} alt={`Slide ${index + 1}`} />
                    </div>
                ))}
            </div>

            {/* Left navigation slide selector button */}
            <button className="btn prev" onClick={prevSlide}>
                ❮
            </button>

            {/* Right navigation slide selector button */}
            <button className="btn next" onClick={nextSlide}>
                ❯
            </button>

            {/* Bottom dot indicators panel linking slides directly */}
            <div className="indicators">
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${currentIndex === index ? "active" : ""
                            }`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
}