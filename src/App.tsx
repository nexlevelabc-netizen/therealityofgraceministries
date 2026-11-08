import { Routes, Route } from "react-router";
import { Layout } from "@/components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Visit from "./pages/Visit";
import Gatherings from "./pages/Gatherings";
import Live from "./pages/Live";
import Give from "./pages/Give";
import Believe from "./pages/Believe";
import Prayer from "./pages/Prayer";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Account from "./pages/Account";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/visit" element={<Visit />} />
        <Route path="/gatherings" element={<Gatherings />} />
        <Route path="/live" element={<Live />} />
        <Route path="/give" element={<Give />} />
        <Route path="/believe" element={<Believe />} />
        <Route path="/prayer" element={<Prayer />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/account" element={<Account />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
