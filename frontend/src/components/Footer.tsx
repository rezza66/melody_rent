import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-600 text-white py-4">
      <div className="container mx-auto px-4 text-center">
        <p>
          © {currentYear} RentMusik. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;