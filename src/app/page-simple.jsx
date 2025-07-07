// Simple home page that doesn't use database for testing
import { Navbar, Footer } from "@/components";
import Hero from "./hero";
import Feature from "./feature";
import MobileConvenience from "./mobile-convenience";
import Testimonials from "./testimonials";
import Faqs from "./faqs";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Feature />
      <MobileConvenience />
      <Testimonials />
      <Faqs />
      <Footer />
    </>
  );
}
