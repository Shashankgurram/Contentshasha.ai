
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center py-8">
      <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-[length:200%_auto] animate-gradient-x">
        contentflow.ai
      </h1>
      <p className="mt-3 text-lg text-indigo-200">
        AI-Powered Content Ideas for YouTube & Instagram
      </p>
    </header>
  );
};

export default Header;
