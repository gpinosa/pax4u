/**
 * app/page.tsx — Home de Pax4u
 */

import Beneficios from "./components/beneficios";
import Footer from "./components/Footer";
import ComoFunciona from "./components/funcionamiento";
import Hero from "./components/hero";
import Navbar from "./components/navbar";
import Partners from "./components/partners";
import Servicios from "./components/service";



export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Partners />
        <Servicios />
        <Beneficios />
        <ComoFunciona />
      </main>
      <Footer />
    </>
  );
}