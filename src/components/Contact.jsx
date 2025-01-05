import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea.jsx";
import { motion } from "framer-motion";
import { useState } from "react";
import { HiChat, HiMail, HiPhone } from "react-icons/hi"; // Import icons from react-icons
import Swal from "sweetalert2";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission and show toast
    const sendMessage = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate form submission
        setTimeout(() => {
            setLoading(false);
            Swal.fire({
                icon: "success",
                title: "Message Sent!",
                text: "Thank you for reaching out! I'll get back to you as soon as possible.",
                showConfirmButton: true,
                timer: 5000,
            });

            // Reset form
            setFormData({
                name: "",
                email: "",
                message: "",
            });
        }, 1000); // Simulate a delay for form submission
    };

    return (
        <section
            id="contact"
            className="container px-6 py-8 mx-auto md:px-12 lg:px-20 font-inter"
        >
            <motion.h2
                className="mb-6 text-3xl font-semibold text-gray-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                Contact Me
            </motion.h2>
            <div className="flex flex-col items-start justify-between gap-4 mx-auto lg:flex-row max-w-7xl">
                {/* Left Side: Contact Info Cards */}
                <div className="flex flex-col items-center w-full space-y-6 lg:w-1/3">
                    <motion.div
                        className="flex items-center w-full p-6 space-x-4 transition-shadow duration-300 ease-in-out border border-gray-300 rounded-lg shadow-lg hover:shadow-xl"
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <HiMail className="text-3xl text-gray-600" />
                        <div>
                            <h3 className="mb-4 text-2xl font-semibold text-gray-800">
                                Email
                            </h3>
                            <p className="text-lg text-gray-600">
                                <a
                                    href="mailto:sajjad.islam523@gmail.com"
                                    className="text-blue-600 hover:underline"
                                >
                                    sajjad.islam523@gmail.com
                                </a>
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex items-center w-full p-6 space-x-4 transition-shadow duration-300 ease-in-out border border-gray-300 rounded-lg shadow-lg hover:shadow-xl"
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <HiPhone className="text-3xl text-gray-600" />
                        <div>
                            <h3 className="mb-4 text-2xl font-semibold text-gray-800">
                                Phone
                            </h3>
                            <p className="text-lg text-gray-600">
                                <a
                                    href="tel:+8801634181621"
                                    className="text-blue-600 hover:underline"
                                >
                                    01634181621
                                </a>
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex items-center w-full p-6 space-x-4 transition-shadow duration-300 ease-in-out border border-gray-300 rounded-lg shadow-lg hover:shadow-xl"
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <HiChat className="text-3xl text-gray-600" />
                        <div>
                            <h3 className="mb-4 text-2xl font-semibold text-gray-800">
                                WhatsApp
                            </h3>
                            <p className="text-lg text-gray-600">
                                <a
                                    href="https://wa.me/8801634181621"
                                    className="text-blue-600 hover:underline"
                                >
                                    Chat with me on WhatsApp
                                </a>
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Right Side: Contact Form */}
                <motion.div
                    className="w-full pl-0 lg:w-2/3 md:pl-8"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <p className="mb-4 text-lg text-gray-600">
                        If you have any questions or would like to get in touch,
                        feel free to send me a message below.
                    </p>

                    {/* Contact Form */}
                    <motion.form
                        onSubmit={sendMessage}
                        className="space-y-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.9 }}
                    >
                        <div className="space-y-4">
                            <Input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your Name"
                                required
                                className="w-full p-4 border rounded-lg shadow-sm"
                            />
                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Your Email"
                                required
                                className="w-full p-4 border rounded-lg shadow-sm"
                            />
                            <Textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Your Message"
                                required
                                className="w-full p-4 border rounded-lg shadow-sm"
                                rows={4}
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                            {loading ? "Sending..." : "Send Message"}
                        </Button>
                    </motion.form>
                </motion.div>
            </div>
        </section>
    );
};

export default Contact;
