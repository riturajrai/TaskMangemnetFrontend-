"use client";
import Image from "next/image";
import Link from "next/link";

export default function Card({ title, image, href = "#", color, index = 0 }) {
  return (
    <Link
      href={href}
      className={`flex flex-col sm:flex-row items-center justify-center 
                  w-[90%] sm:w-[300px] md:w-[350px] lg:w-[400px] 
                  min-h-[100px] sm:h-[130px] 
                  bg-gradient-to-r ${color} 
                  hover:opacity-90 transition-all duration-300 
                  rounded-2xl shadow-md p-4 cursor-pointer`}
    >
      {/* Image */}
      <div className="flex-shrink-0">
        <Image
          src={image}
          alt={title}
          width={80}
          height={80}
          className="rounded-xl object-cover w-[60px] h-[60px] sm:w-[80px] sm:h-[80px]"
        />
      </div>

      {/* Title */}
      <div className="flex flex-col text-center sm:text-left mt-2 sm:mt-0 sm:ml-4">
        <h3 className="text-sm sm:text-lg md:text-xl font-semibold text-white leading-tight">
          {title}
        </h3>
      </div>
    </Link>
  );
}
