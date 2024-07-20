import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentsData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://njmc.horus.edu.eg/api/hue/portal/v1/uiTotalsData/5617'); // Replace with your actual API endpoint
        setData(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run the effect only once

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Total Data Component</h1>
      <ul>
        {data.map(item => (
          <li key={item.id}>
            {item.gpa} - {item.student_name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentsData;
