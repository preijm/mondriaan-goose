import React from "react";
import { Link } from "react-router-dom";
import { Milk, ChartPie, Table, Info } from "lucide-react";
import { AuthButton } from "@/components/AuthButton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Home = () => {
  const carouselImages = [
    {
      src: "/dairy1.jpg",
      alt: "Fresh milk being poured",
      caption: "Experience the freshness of dairy"
    },
    {
      src: "/dairy2.jpg",
      alt: "Various dairy products",
      caption: "Discover different varieties"
    },
    {
      src: "/dairy3.jpg",
      alt: "Milk tasting session",
      caption: "Join the tasting journey"
    }
  ];

  return (
    <div className="min-h-screen bg-milk-50 py-8 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="flex justify-end mb-4">
          <AuthButton />
        </div>

        <div className="mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center animate-fade-up">
            Dairy Taste Trove
          </h1>
          <p className="text-lg text-milk-500 text-center mb-8 animate-fade-up" style={{ animationDelay: "200ms" }}>
            Your personal journey through the world of dairy, one taste test at a time.
          </p>

          <div className="max-w-4xl mx-auto mb-16 animate-fade-up" style={{ animationDelay: "400ms" }}>
            <Carousel className="w-full">
              <CarouselContent>
                {carouselImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-video">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 rounded-b-lg">
                        <p className="text-white text-lg font-medium">{image.caption}</p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-up" style={{ animationDelay: "600ms" }}>
          <Link to="/dashboard" className="group h-full">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-full">
              <ChartPie className="w-12 h-12 text-milk-400 mb-4 group-hover:text-milk-500 transition-colors" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Dashboard</h2>
              <p className="text-milk-500">Visualize your milk tasting journey with interactive charts and statistics.</p>
            </div>
          </Link>

          <Link to="/results" className="group h-full">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-full">
              <Table className="w-12 h-12 text-milk-400 mb-4 group-hover:text-milk-500 transition-colors" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Results</h2>
              <p className="text-milk-500">View and manage all your milk tasting results in a detailed table.</p>
            </div>
          </Link>

          <Link to="/add" className="group h-full">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-full">
              <Milk className="w-12 h-12 text-milk-400 mb-4 group-hover:text-milk-500 transition-colors" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Add Test</h2>
              <p className="text-milk-500">Record your latest milk tasting experience.</p>
            </div>
          </Link>

          <Link to="/about" className="group h-full">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-full">
              <Info className="w-12 h-12 text-milk-400 mb-4 group-hover:text-milk-500 transition-colors" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">About</h2>
              <p className="text-milk-500">Learn more about our milk tasting methodology and mission.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;