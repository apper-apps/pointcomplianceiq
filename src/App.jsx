import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ComplianceDashboard from "@/components/pages/ComplianceDashboard";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ComplianceDashboard />} />
        <Route path="*" element={<ComplianceDashboard />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="font-inter"
        style={{ zIndex: 9999 }}
      />
    </>
  );
}

export default App;