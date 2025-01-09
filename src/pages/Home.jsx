import About from "../components/About.jsx";
import Contact from "../components/Contact.jsx";
import Education from "../components/Education.jsx";
import Hero from "../components/Hero.jsx";
import Projects from "../components/Projects.jsx";
import Skills from "../components/Skills.jsx";

const Home = () => {
    return (
        <div>
            <Hero />
            <About />
            <Education />
            <Skills />
            <Projects />
            <Contact />
        </div>
    );
};

export default Home;
