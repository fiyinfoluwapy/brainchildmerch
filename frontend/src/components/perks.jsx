// components/Perks.jsx
import React from 'react';
import original from '../img/original.png';
import delivery from '../img/delivery-truck.gif';
import approved from '../img/approved.gif';
import singlet from '../img/singlet.gif';

const perks = () => {
  return (
    <section className="perks-section bg-transparent py-10" id="perks">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-2 mb-2 p-6" data-animate="fade">
        
        {/* Premium Apparels Card */}
        <div className="flex items-center bg-black p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-center" style={{ marginRight: '0.8rem', width: '200px', height: '50px' }}>
            <img src={singlet} alt="Premium Apparels" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-2 font-sub-heading-font">Premium Apparels</h3>
            <p className="text-gray-200 text-sm">Quality you can feel. Style you can trust.</p>
          </div>
        </div>

        {/* Authentic Items Card */}
        <div className="flex items-center bg-yellow-400 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-center" style={{ marginRight: '0.8rem', width: '200px', height: '50px' }}>
            <img src={original} alt="Authentic Items" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-black mb-2 font-sub-heading-font">Authentic Items</h3>
            <p className="text-black text-sm">Genuine gear made for those who dare.</p>
          </div>
        </div>

        {/* Swift Delivery Card */}
        <div className="flex items-center bg-blue-500 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-center" style={{ marginRight: '0.8rem', width: '200px', height: '50px' }}>
            <img src={delivery} alt="Swift Delivery" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-2 font-sub-heading-font">Swift Delivery</h3>
            <p className="text-white text-sm">Fast and reliable shipping, straight to your door.</p>
          </div>
        </div>

        {/* Secure Payment Card */}
        <div className="flex items-center bg-red-500 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-center" style={{ marginRight: '0.8rem', width: '200px', height: '50px' }}>
            <img src={approved} alt="Secure Payment" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-black mb-2 font-sub-heading-font">Secure Payment</h3>
            <p className="text-black text-sm">Your transactions are always safe with us.</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default perks;
