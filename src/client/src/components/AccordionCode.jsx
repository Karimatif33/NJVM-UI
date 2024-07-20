import React, { useState } from "react";

const Accordion = () => {
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);

  const handleToggle = () => {
    const accordion = document.getElementById("accordion");
    if (accordion.open) {
      setWidth(accordion.offsetWidth);
      setHeight(accordion.offsetHeight);
    } else {
      setWidth(null);
      setHeight(null);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <details
        id="accordion"
        className="border border-gray-300 rounded-lg mb-4"
        onToggle={handleToggle}
      >
        <summary className="cursor-pointer bg-gray-200 p-4 rounded-t-lg rounded-b-lg dark:bg-gray-700">
          Courses Id's
        </summary>
        <div className="text-center p-4 bg-gray-50 rounded-b-lg dark:bg-gray-900">
          <pre>
            <code className="language-html font-bold ">
              {/* Your HTML code here */}
               DT(5) 
              <hr />
               PT(6) PT22(32) <br />
              <hr />
              Ph(1) PHD(13) PHD-C(20) <br />
              <hr />
              MED (15) MED23 (45)<br />
               <hr />
               PRP(7) Arc(8) CIV(9) <br />
              COM(11) MECH(12) <br />
              <hr />
               Bus(2) Acc(3) Man(4) BUS-AR (24) <br />
              ACC-AR(30) MAN-AR(31) BUS22(37) <br />
              Acc22(42) Man22(43) <br />
            </code>
          </pre>
        </div>
      </details>
    </div>
  );
};

export default Accordion;
