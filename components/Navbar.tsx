import React from "react";
import { SignupBtn } from "./Buttons";
import Logo from "./Logo";
import { LoginBtn } from "./Buttons";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg flex gap-4 lg:pr-52 px-4  items-center">
      <Logo />
      <LoginBtn />
      <SignupBtn />
    </nav>
  );
};

export default Navbar;
