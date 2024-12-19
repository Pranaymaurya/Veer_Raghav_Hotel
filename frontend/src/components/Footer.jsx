import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-amber-600 text-white " style={{
      fontFamily :"font-serif font-semibold",
     backgroundColor :"#FFF5E5",
     color :"#FF9933"
    }}>
 
      <div className="container mx-auto px-4 py-12">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {/* Location Map Section */}
         

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FaPhone size={20} />
                <span>Reservation: +91 7376717607</span>
              </div>
              <div className="flex items-center gap-2">
                <FaPhone size={20} />
                <span>Booking: +91 7376717607</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt size={20} />
                <span>259 Uttar Paras math Near kanak bhavan mandir ayodhya 224123 uttar pradesh</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-center ">
          <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-6 justify-center">
                <a href="#facebook" className="hover:text-amber-200 transition-colors">
                  <FaFacebook size={24} />
                </a>
                <a href="#twitter" className="hover:text-amber-200 transition-colors">
                  <FaTwitter size={24} />
                </a>
                <a href="#instagram" className="hover:text-amber-200 transition-colors">
                  <FaInstagram size={24} />
                </a>
                <a href="#youtube" className="hover:text-amber-200 transition-colors">
                  <FaYoutube size={24} />
                </a>
              </div>
            </div>

          {/* Drop a Line Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Drop a Line</h3>
            <div className="space-y-3">
              {/* <div className="flex items-center gap-2">
                <FaEnvelope size={20} />
                <span>veerraghaw98@gmail.com</span>
              </div> */}
              <div className="flex items-center gap-2">
                <FaEnvelope size={20} />
                <span>veerraghaw98@gmail.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Social Media Links */}
        <div className="mt-12 pt-8 border-t border-amber-500">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="text-sm">© 2024 All rights reserved</div>
            {/* <div className="flex gap-6">
              {['Facebook', 'Twitter', 'Instagram', 'Pinterest', 'YouTube'].map((social) => (
                <a
                  key={social}
                  href={`#${social.toLowerCase()}`}
                  className="hover:text-amber-200 transition-colors"
                >
                  {social}
                </a>
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
