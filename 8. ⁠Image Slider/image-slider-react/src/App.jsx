import ImageSlider from "./ImageSlider";

// Root Component rendering the main portfolio layout containing the React Image Slider
function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f4f4", // Light gray background
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

      {/* Renders the ImageSlider component displaying images */}
      <ImageSlider />
    </div>
  );
}

export default App;