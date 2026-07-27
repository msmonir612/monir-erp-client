import Header from "../Components/Home/Header";
import Hero from "../Components/Home/Hero";
import About from "../Components/Home/About";
import Services from "../Components/Home/Services";
import Features from "../Components/Home/Features";
// import WhyChoose from "../Components/Home/WhyChoose";
import Contact from "../Components/Home/Contact";
import Footer from "../Components/Home/Footer";
import Management from "../Components/Home/Management";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">

      <Header />

      <main>
        <Hero />

   <section id="management">
          <Management />
        </section>

        <section id="about">
          <About />
        </section>

        <section id="services">
          <Services />
        </section>
     
      <section id="features">
 <Features />
      </section>
      
        <section id="contact">
          <Contact />
        </section>
      </main>

      <Footer />

    </div>
  );
};

export default Home;