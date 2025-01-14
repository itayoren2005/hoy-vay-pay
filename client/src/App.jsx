import "./App.css";
import { AuthForm } from "./components/AuthForm";
import { ToastContainer } from "react-toastify";
import { Route, Routes } from "react-router";
import { Dashboard } from "./components/Dashboard";
import { Navbar } from "./components/Navbar";
import { useAuth } from "./components/AuthProvider";

function App() {
  const { user, isPending, isLoggedIn } = useAuth();

  if (isPending) return <div>Loading...</div>;

  console.log(user);

  return (
    <>
      {isLoggedIn ? <Navbar /> : null}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/auth" element={<AuthForm />} />
      </Routes>
      <ToastContainer position="top-right" theme="colored" autoClose={5000} />
    </>
  );
}

export default App;
