import { useState, useCallback, lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CartDrawer from "@/components/CartDrawer";
import UserLoginModal from "@/components/UserLoginModal";
import SplashScreen from "@/components/SplashScreen";
import NetworkStatus from "@/components/NetworkStatus";
import SectionLoader from "@/components/SectionLoader";

const About = lazy(() => import("@/components/About"));
const Collections = lazy(() => import("@/components/Collections"));
const Products = lazy(() => import("@/components/Products"));
const CustomOrders = lazy(() => import("@/components/CustomOrders"));
const Testimonials = lazy(() => import("@/components/Testimonials"));
const FAQ = lazy(() => import("@/components/FAQ"));
const SizeGuide = lazy(() => import("@/components/SizeGuide"));
const Social = lazy(() => import("@/components/Social"));
const Footer = lazy(() => import("@/components/Footer"));

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <NetworkStatus />
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <Navbar />
      <CartDrawer />
      <UserLoginModal />
      <Hero />
      <Suspense fallback={<SectionLoader />}>
        <About />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Collections />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Products />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <CustomOrders />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Testimonials />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <SizeGuide />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <FAQ />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Social />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
