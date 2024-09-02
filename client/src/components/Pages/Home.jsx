import React from 'react';

function Home() {
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role; // Check if user exists and has a role

    return (
        <>
            <div className="main-content">
                <h1 className='w-1000 flex justify-center items-center text-black mb-3 text-xl mt-10'>
                    {role === 'Super Admin' && "Welcome, Super Admin!"}
                    {role === 'Admin' && "Welcome, Admin!"}
                    {/* Add more role-specific content here as needed */}
                </h1>
            </div>
        </>
    );
}

export default Home;
