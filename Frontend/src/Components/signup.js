// import React, { useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';

// const signup = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');

//   const handleSignUp = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post('https://your-backend-url.com/api/signup', {
//         email,
//         password,
//       });

//       if (response.data.success) {
//         setMessage('A verification email has been sent to your email address. Please verify your email to sign in.');
//       } else {
//         setMessage('An error occurred during sign up. Please try again.');
//       }
//     } catch (error) {
//       console.error('Sign up failed', error);
//       setMessage('An error occurred during sign up. Please try again.');
//     }
//   };

//   return (   
//     <div>
//       <form onSubmit={handleSignUp}>
//         <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
//         <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
//         <button type="submit">Sign Up</button>
//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default SignUp;