import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <div className="bg-[#313030] flex justify-evenly items-center text-white text-sm h-48 lg:flex-row flex-col">
      <a href="https://www.krishnayadav.site">Visit My Site</a>
      <div className="flex justify-center items-center">
        {["/instagram.png", "/x.png", "/linkedin.png"].map((url, index) => (
          <a href="https://krishnayadav.site" key={index}>
            <Image
              key={index}
              src={url}
              alt={url}
              width={40}
              height={40}
              className="bg-cover p-2 rounded-md cursor-pointer active:scale-95"
            />
          </a>
        ))}
      </div>
      <p>@ 2025 Krishna Yadav , All rights reserved</p>
    </div>
  );
};

export default Footer;
