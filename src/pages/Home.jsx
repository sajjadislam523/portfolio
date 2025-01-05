import About from "../components/About.jsx";
import Contact from "../components/Contact.jsx";
import Hero from "../components/Hero.jsx";
import Projects from "../components/Projects.jsx";
import Skills from "../components/Skills.jsx";

const Home = () => {
    return (
        <div>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Contact />
        </div>
    );
};

export default Home;
