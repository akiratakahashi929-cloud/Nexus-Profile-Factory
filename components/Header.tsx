
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white py-14 px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        <div className="w-20 h-1.5 bg-gradient-to-r from-[#E6007E] to-[#009FE3] rounded-full mb-8 shadow-sm"></div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-[#333] italic">
          X-Core
        </h1>
        <p className="text-slate-400 font-black text-[10px] tracking-[0.3em] uppercase bg-slate-50 px-4 py-2 rounded-full border border-slate-100 shadow-inner">
          Algorithm Optimization & Personalized AI
        </p>
      </div>
    </header>
  );
};

export default Header;
