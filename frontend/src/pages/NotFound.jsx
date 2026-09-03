// import React from 'react'
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-red-50">
      <section className="flex flex-col min-h-screen items-center justify-center gap-3 px-4">
        <h1 className="text-9xl font-bold text-[#b83f24]">404</h1>
        <h3 className="text-3xl font-bold">Not Found</h3>
        <p className="text-gray-600">
          The page that you are looking for doesn't exist.
        </p>
        <Link
          to="/login"
          className="mt-4 font-medium text-primary underline-offset-4 hover:scale-105 duration-500 underline"
        >
          Return to Login
        </Link>
      </section>
    </div>
  );
}
