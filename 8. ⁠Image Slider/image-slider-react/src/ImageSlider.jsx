import { useState, useEffect } from "react";
import "./ImageSlider.css";

const images = [
    "https://picsum.photos/id/1015/1000/600",
    "https://picsum.photos/id/1016/1000/600",
    "https://picsum.photos/id/1018/1000/600",
    "https://picsum.photos/id/1020/1000/600",
];

export default function ImageSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="slider">
            <div
                className="slides"
                style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                }}
            >
                {images.map((image, index) => (
                    <div className="slide" key={index}>
                        <img src={image} alt={`Slide ${index + 1}`} />
                    </div>
                ))}
            </div>

            <button className="btn prev" onClick={prevSlide}>
                ❮
            </button>

            <button className="btn next" onClick={nextSlide}>
                ❯
            </button>

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