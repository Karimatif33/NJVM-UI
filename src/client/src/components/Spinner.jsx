// Spinner.js
import React from 'react';
import { BeatLoader } from 'react-spinners';
import OverlayImage from '../utiltis/IMG/Loadar.png'; // Adjust the path as needed

const Spinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
<div className="flex flex-col items-center gap-4"> {/* Adjust gap as needed */}
  <img
    src={OverlayImage}
    alt="Overlay"
    className="w-32 h-32"
  />
  <BeatLoader color="#b88b1a" size={20} />
</div>
    </div>
  );
};

export default Spinner;
  