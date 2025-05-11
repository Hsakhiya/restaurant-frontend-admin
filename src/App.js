import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import Menu from "./pages/Menu";
import OrdersByTable from "./pages/OrdersByTable";
import Dashboard from "./pages/Dashboard";
function App() {
  return (
    <Router>
      <Layout>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/orders" element={<OrdersByTable />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      </Layout>
    </Router>
  );
}

export default App;
