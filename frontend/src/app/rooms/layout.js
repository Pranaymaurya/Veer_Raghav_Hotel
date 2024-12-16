import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function RoomsLayout({ children }) {
    return (
      <div>
        <Navbar />
        {children}
        <Footer />
      </div>
    )
  }
  
  