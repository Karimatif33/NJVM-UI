import React, { useEffect } from 'react';
import axios from 'axios';
const SsoDemo = () => {
//   useEffect(() => {
//     // Fetch the profile information from the server
//     axios.post('/getProfileOnBehalfOf', {
//       tid: '<tenant-id>',
//       token: '<auth-token>'
//     })
//     .then(response => {
//       console.log(response.data);
//     })
//     .catch(error => {
//       console.error('There was an error!', error);
//     });
//   }, []);

  return (
    <div>
      <h1>SSO Demo</h1>
      <p>Profile information will be fetched from the server.</p>
    </div>
  );
}

export default SsoDemo;
