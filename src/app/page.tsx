import Hero from "./components/Hero/Hero";
import Features from "./components/Features/Features";
import MapHomepage from "./components/MapHomepage/MapHomepage";

export default function Home() {
  return (
    <div className="bg-[#132536] w-full">
      <Hero />
      <MapHomepage />
      <Features />
    </div>
  );
}
