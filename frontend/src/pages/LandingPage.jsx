import { Link } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Carousel from "@/components/Carousel";
import Footer from "@/components/Footer";
import { Rocket, Users, CalendarDays } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function Home() {
    const images = [
        "/images/slide1.jpg",
        "/images/slide2.jpg",
        "/images/slide3.jpg",
    ];

    return (
        <>
            <NavBar />
            {/* Carousel Section */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="overflow-hidden shadow-md z-10 relative"
            >
                <Carousel images={images} />
            </motion.section>

            <div className="relative px-6 py-4 overflow-hidden">
                {/* Decorative Background Blobs */}
                <img
                    src="/decorations/blob1.svg"
                    alt="blob"
                    className="absolute top-[-100px] left-[-100px] w-96 opacity-20 pointer-events-none z-0"
                />
                <img
                    src="/decorations/blob2.svg"
                    alt="blob"
                    className="absolute bottom-[-100px] right-[-100px] w-96 opacity-20 pointer-events-none z-0"
                />

                {/* Hero Section */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="min-h-screen flex items-center justify-center bg-base-100/80 backdrop-blur-xl border border-base-300 rounded-xl shadow-xl text-base-content px-4 relative z-10"
                >
                    <div className="max-w-5xl text-center space-y-6">
                        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
                            Empower Your Events
                        </h1>
                        <p className="text-lg md:text-xl">
                            Create, manage, and track events effortlessly. One platform to do it all.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-xl mx-auto">
                            <Link to="/createEvent" className="btn btn-accent btn-lg w-full">
                                Create Event
                            </Link>
                            <Link to="/AllEventsPage" className="btn btn-outline btn-lg w-full">
                                Browse Events
                            </Link>
                            <Link to="/Attendance" className="btn btn-info btn-lg w-full">
                                Mark Attendance
                            </Link>
                        </div>
                    </div>
                </motion.section>

                {/* Why Us Section */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="mt-20 relative z-10"
                >
                    <h2 className="text-3xl font-bold text-center mb-10 text-secondary">
                        Why Choose Us?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Rocket size={40} className="text-primary" />}
                            title="Quick Setup"
                            desc="Launch your event in under 5 minutes. Our streamlined process is built for ease."
                        />
                        <FeatureCard
                            icon={<Users size={40} className="text-secondary" />}
                            title="Engaged Community"
                            desc="Join thousands of organizers and attendees on our growing platform."
                        />
                        <FeatureCard
                            icon={<CalendarDays size={40} className="text-accent" />}
                            title="Real-Time Attendance"
                            desc="Track attendance instantly and generate detailed reports for your events."
                        />
                    </div>
                </motion.section>

                {/* Stats Section */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="mt-20 bg-base-300/80 backdrop-blur-xl rounded-xl p-10 text-center shadow-xl relative z-10"
                >
                    <h3 className="text-2xl font-bold mb-6 text-primary">By the Numbers</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                        <StatBox value="10K+" label="Events Hosted" color="text-success" />
                        <StatBox value="50K+" label="Attendees Registered" color="text-info" />
                        <StatBox value="4.9/5" label="User Rating" color="text-warning" />
                    </div>
                </motion.section>

                {/* CTA Section */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="mt-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl p-12 shadow-xl text-center z-10 relative"
                >
                    <h3 className="text-4xl font-bold mb-4">Get Started With Event Management</h3>
                    <p className="mb-6 text-lg">
                        No more spreadsheets or confusion — just seamless event handling.
                    </p>
                    <Link to="/createEvent" className="btn btn-lg btn-accent shadow-md">
                        Create Your Event Now
                    </Link>
                </motion.section>
            </div>

            <Footer />
        </>
    );
}

function FeatureCard({ icon, title, desc }) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="bg-base-100 p-6 rounded-xl shadow-md text-center transition-all"
        >
            <div className="mb-4">{icon}</div>
            <h4 className="text-xl font-semibold mb-2">{title}</h4>
            <p className="text-base-content">{desc}</p>
        </motion.div>
    );
}

function StatBox({ value, label, color }) {
    return (
        <div className="space-y-2">
            <p className={`text-4xl font-bold ${color}`}>{value}</p>
            <p className="text-base-content">{label}</p>
        </div>
    );
}
