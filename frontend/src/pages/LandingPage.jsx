import NavBar from "@/components/NavBar";
import Carousel from "@/components/Carousel";
import Footer from "@/components/Footer";
import WhyUs from "@/components/WhyUs";


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

            {/* <div className="container mx-auto">
                <h2 className="text-3xl font-bold text-center mb-8">Categories</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 mb-12">
                    {categories.map((cat) => (
                        <CategoryCard
                            key={cat.title}
                            title={cat.title}
                            description={cat.description}
                            imageSrc={cat.image}
                        />
                    ))}
                </div>
            </div> */}

            <WhyUs />
            <Footer />
        </>
    );
}