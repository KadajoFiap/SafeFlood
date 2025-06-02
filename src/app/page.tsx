import Hero from "./components/Hero/Hero";
import Features from "./Features/Features";
import MapHomepage from "./MapHomepage/MapHomepage";

export default function Home() {
  return (
    <div className="bg-[#132536]">
      <Hero />
      <MapHomepage />
      <Features />
    </div>
  );
}
