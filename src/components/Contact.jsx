import { Button } from "@/components/ui/button.jsx";
import emailjs from "@emailjs/browser";
import { useRef, useState } from "react";
import { FaEnvelope, FaFacebookMessenger } from "react-icons/fa";
import { HiPaperAirplane } from "react-icons/hi";
import { IoLogoWhatsapp } from "react-icons/io5";
import Swal from "sweetalert2";

const Contact = () => {
    const form = useRef();
    const [loading, setLoading] = useState(false);

    const sendEmail = (e) => {
        e.preventDefault();

        setLoading(true);

        emailjs
            .sendForm("service_x8q25ae", "template_b769g6v", form.current, {
                publicKey: "yRb1PpRZy_Suy_m7J",
            })
            .then(
                () => {
                    setLoading(false); // Stop loading
                    Swal.fire({
                        icon: "success",
                        title: "Message Sent!",
                        text: "Thank you for reaching out! I'll get back to you as soon as possible.",
                        showConfirmButton: true,
                        timer: 5000,
                    });
                },
                (error) => {
                    console.log("FAILED...", error.text);
                    setLoading(false); // Stop loading even on failure
                }
            );
    };

    return (
        <section
            id="contact"
            className="container px-6 py-8 mx-auto md:px-12 lg:px-20 font-inter"
        >
            <h2 className="mb-6 text-3xl font-semibold text-center text-gray-800">
                Contact Me
            </h2>

            <div className="flex flex-col items-start justify-between gap-12 mx-auto lg:flex-row max-w-7xl">
                {/* Left Side: Contact Info Cards */}
                <div className="flex flex-col w-full gap-6 lg:w-1/2">
                    <p>Talk to me</p>
                    {/* Email Card */}
                    <div className="flex flex-col items-center p-6 transition-transform duration-700 border rounded-lg shadow-md hover:shadow-lg hover:scale-105 ">
                        <FaEnvelope className="mb-3 text-3xl text-primary" />
                        <h3 className="mb-2 text-lg font-semibold text-gray-800">
                            Email
                        </h3>
                        <p className="text-gray-600">
                            sajjad.islam523@gmail.com
                        </p>
                    </div>

                    {/* WhatsApp Card */}
                    <div className="flex flex-col items-center p-6 transition-transform duration-700 border rounded-lg shadow-md hover:shadow-lg hover:scale-105 ">
                        <IoLogoWhatsapp className="mb-3 text-3xl " />
                        <h3 className="mb-2 text-lg font-semibold text-gray-800">
                            WhatsApp
                        </h3>
                        <p className="text-gray-600">+8801634181621</p>
                    </div>

                    {/* Messenger Card */}
                    <div className="flex flex-col items-center p-6 transition-transform duration-700 border rounded-lg shadow-md hover:shadow-lg hover:scale-105 ">
                        <FaFacebookMessenger className="mb-3 text-2xl " />
                        <h3 className="mb-2 font-semibold text-gray-800 text-md">
                            Facebook Messenger
                        </h3>
                        <p className="text-gray-600">Sajjadul Islam</p>
                    </div>
                </div>

                {/* Right Side: Contact Form */}
                <div className="w-full lg:w-1/2">
                    <h3 className="text-xl font-semibold text-gray-800 ">
                        Write me your query
                    </h3>

                    <form
                        ref={form}
                        onSubmit={sendEmail}
                        className="p-6 space-y-6 border rounded-lg shadow-md"
                    >
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block mb-2 text-sm font-medium text-gray-700"
                                >
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="user_name"
                                    placeholder="Insert your name"
                                    required
                                    className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-gray-700"
                                >
                                    Mail
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="user_email"
                                    placeholder="Insert your email"
                                    required
                                    className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="project"
                                    className="block mb-2 text-sm font-medium text-gray-700"
                                >
                                    Project
                                </label>
                                <textarea
                                    id="project"
                                    name="message"
                                    placeholder="Write your project"
                                    required
                                    rows={5}
                                    className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring focus:ring-primary"
                                ></textarea>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center w-full px-6 py-3 text-sm font-medium rounded-lg shadow-md"
                        >
                            {loading ? "Sending..." : "Send Message"}{" "}
                            <HiPaperAirplane className="ml-2 text-lg rotate-45" />
                        </Button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
