import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa"; // Import icons

const Footer = () => {
    return (
        <footer className="py-6">
            <div className="mx-auto text-center max-w-7xl">
                <div className="flex items-center justify-between py-4">
                    <div>
                        <h2 className="text-2xl font-medium cursor-pointer font-poppins">
                            Sajjad
                        </h2>
                    </div>
                    <div className="flex gap-4 mt-4">
                        <a
                            href="https://www.linkedin.com"
                            className="mx-2 "
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaLinkedin className="text-2xl" />
                        </a>
                        <a
                            href="https://github.com"
                            className="mx-2 "
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaGithub className="text-2xl" />
                        </a>
                        <a
                            href="mailto:your-email@example.com"
                            className="mx-2 "
                        >
                            <FaEnvelope className="text-2xl" />
                        </a>
                    </div>
                </div>

                <hr className="my-4 border-t-2 border-gray-300" />

                <p className="text-sm font-inter">
                    &copy; {new Date().getFullYear()} Your Website. All rights
                    reserved by Sajjad.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
