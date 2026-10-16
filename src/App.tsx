
import { Routes, Route } from "react-router";
import NavBar from "./components/NavBar/NavBar";
import ScrollBar from "./components/ScrollBar/ScrollBar";
import Home from "./pages/Home/Home";

function App() {


  return (
    <>
      <ScrollBar />
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>

    </>
  )
}

export default App
