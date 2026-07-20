import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Metrics from "./components/Metrics";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import GithubRepos from "./components/GithubRepos";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Hero />
      <Metrics />
      <About />
      <Skills />
      <Projects />
      <GithubRepos />
      <Contact />
      <Footer />
      <BackToTop />
    </AuthProvider>
  );
}

export default App;
