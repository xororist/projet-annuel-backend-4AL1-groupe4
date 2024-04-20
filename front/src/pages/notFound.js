import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-md shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">404 - Page Not Found</h2>
        <p className="text-lg text-center text-gray-600 mb-8">Oops! The page you're looking for doesn't exist.</p>
        <div className="flex justify-center">
          <Link
            to="/Login"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
