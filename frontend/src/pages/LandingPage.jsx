import NavBar from "@/components/NavBar";
import Carousel from "@/components/Carousel";
import Footer from "@/components/Footer";
import WhyUs from "@/components/WhyUs";
import { Link } from "react-router-dom";



export default function Home() {
    const images = [
        "/images/slide1.jpg",
        "/images/slide2.jpg",
        "/images/slide3.jpg"
    ];


    return (
        <>
            <NavBar />
            <div className="p-6">
                <Carousel images={images} />
            </div>

            <Link to="/createEvent">Go to create Event</Link>
            <br />
            <Link to="/AllEventsPage">Go to All Event</Link>

            <WhyUs />
            <Footer />
        </>
    );
}