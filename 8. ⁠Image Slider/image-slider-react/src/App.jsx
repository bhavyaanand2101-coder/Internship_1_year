import ImageSlider from "./ImageSlider";

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f4f4",
        padding: "20px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "30px",
          color: "#333",
        }}
      >
        React Image Slider
      </h1>

      <ImageSlider />
    </div>
  );
}

export default App;