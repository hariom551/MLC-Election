import { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import backgroundImage from './LoginImage.jpg';

function Login() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  

  useEffect(() => {
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', options);
    setDate(dateString);
    setTime(`${hours}:${minutes}:${seconds}`);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors

    try {
      const response = await fetch(`/api/v1/users/login`, {
        method: 'POST',
        body: JSON.stringify({ userid: userId, password }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (response.ok) {
        const { user, token } = data.data;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        // navigate('/home'); 
        window.location.href='/home';
      } else {
        setError(data.message); 
      }
    } catch (error) {
      console.error('Login request failed:', error);
      setError('Invalid user credentials.');
    }
  };

  return (
    <>
      <div className='100vh h-full'>
        <div style={{ backgroundImage: `url(${backgroundImage})`, backgroundPosition: 'center', backgroundSize: 'cover', width: "100%", height: '100vh' }}>
          <header className="flex justify-between items-center px-6 py-8">
            <span className="text-lg">Login Page</span>
            <div className="text-right text-white">
              <span className="text-lg">{date}</span><br />
              <span className="text-lg">{time}</span>
            </div>
          </header>

          <div className="flex justify-center items-center font-serif mt-[10vw]">
            <Form onSubmit={handleSubmit} className="loginbox max-w-3xl mt-2 mx-auto p-4 rounded-lg shadow-md">
              <Form.Group className="mb-3 pt-4">
                <Form.Label className='text-white'>User Id:</Form.Label>
                <Form.Control
                  type="text"
                  id="userid"
                  name="userid"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                  placeholder="Enter User Id"
                  className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className='text-white'>Password</Form.Label>
                <Form.Control
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                  className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </Form.Group>
              <div className='flex justify-between items-center gap-3'>
                <Button variant="primary" type="submit" className="py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800">
                  Login
                </Button>
                {error && <p className='text-red-600'>{error}</p>} {/* Display error message */}
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
