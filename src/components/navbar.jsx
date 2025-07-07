"use client";

import React from "react";
import Link from "next/link";
import {
  Navbar as MTNavbar,
  Collapse,
  IconButton,
  Typography,
  Button,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
// import ThemeToggle from "./ui/ThemeToggle";
import { usePrimaryColor } from "@/hooks/usePrimaryColor";

function NavItem({ children, href }) {
  return (
    <li>
      <Typography
        as={Link}
        href={href || "#"}
        variant="small"
        className="font-medium"
      >
        {children}
      </Typography>
    </li>
  );
}

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const [isScrolling, setIsScrolling] = React.useState(false);
  const { getMaterialTailwindColor, getButtonColorClass } = usePrimaryColor();
  const primaryColor = getMaterialTailwindColor();

  function handleOpen() {
    setOpen((cur) => !cur);
  }

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpen(false)
    );
  }, []);

  React.useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 100) {
        setIsScrolling(true);
      } else {
        setIsScrolling(false);
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <MTNavbar
      fullWidth
      shadow={false}
      blurred={false}
      color="transparent"
      className={`fixed top-0 z-50 border-0 transition-all duration-300 ${
        isScrolling ? "navbar-glass" : "navbar-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Typography
          as={Link}
          href="/"
          variant="h6"
          className={`transition-colors duration-300 ${
            isScrolling ? "text-gray-900 dark:text-white" : "text-white"
          }`}
        >
          Abdullah Memon
        </Typography>
        <ul
          className={`ml-10 hidden items-center gap-6 lg:flex transition-colors duration-300 ${
            isScrolling ? "text-gray-900 dark:text-gray-100" : "text-white"
          }`}
        >
          <NavItem href="/">Home</NavItem>
          <NavItem href="/about">About</NavItem>
          <NavItem href="/projects">Projects</NavItem>
          <NavItem href="/posts">Posts</NavItem>
          <NavItem href="/contact">Contact</NavItem>
        </ul>
        <div className="hidden gap-2 lg:flex lg:items-center">
          <IconButton
            variant="text"
            className={`transition-colors duration-300 ${
              isScrolling ? "text-gray-700 dark:text-gray-300" : "text-white"
            }`}
            size="sm"
          >
            <i className="fa-brands fa-github text-base" />
          </IconButton>
          <IconButton
            variant="text"
            className={`transition-colors duration-300 ${
              isScrolling ? "text-gray-700 dark:text-gray-300" : "text-white"
            }`}
            size="sm"
          >
            <i className="fa-brands fa-linkedin text-base" />
          </IconButton>
          <IconButton
            variant="text"
            className={`transition-colors duration-300 ${
              isScrolling ? "text-gray-700 dark:text-gray-300" : "text-white"
            }`}
            size="sm"
          >
            <i className="fa-brands fa-twitter text-base" />
          </IconButton>
          {/* <ThemeToggle /> */}
          {/* <Button 
            className={`transition-all duration-300 ${
              isScrolling 
                ? getButtonColorClass() + " text-white" 
                : "bg-white hover:bg-gray-100 text-gray-900"
            }`}
            size="sm"
          >
            Hire Me
          </Button> */}
        </div>
        <IconButton
          variant="text"
          className={`ml-auto inline-block lg:hidden transition-colors duration-300 ${
            isScrolling ? "text-gray-700 dark:text-gray-300" : "text-white"
          }`}
          onClick={handleOpen}
        >
          {open ? (
            <XMarkIcon strokeWidth={2} className="h-6 w-6" />
          ) : (
            <Bars3Icon strokeWidth={2} className="h-6 w-6" />
          )}
        </IconButton>
      </div>
      <Collapse open={open}>
        <div className={`container mx-auto mt-4 rounded-lg px-6 py-5 transition-all duration-300 ${
          isScrolling 
            ? "bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200 dark:border-gray-700" 
            : "bg-gray-900/90 backdrop-blur-md border border-gray-700"
        }`}>
          <ul className={`flex flex-col gap-4 transition-colors duration-300 ${
            isScrolling ? "text-gray-900 dark:text-gray-100" : "text-white"
          }`}>
            <NavItem href="/">Home</NavItem>
            <NavItem href="/about">About</NavItem>
            <NavItem href="/projects">Projects</NavItem>
            <NavItem href="/posts">Posts</NavItem>
            <NavItem href="/contact">Contact</NavItem>
          </ul>
          <div className="mt-4 flex items-center gap-2">
            <IconButton 
              variant="text" 
              className={`transition-colors duration-300 ${
                isScrolling ? "text-gray-700 dark:text-gray-300" : "text-white"
              }`}
              size="sm"
            >
              <i className="fa-brands fa-github text-base" />
            </IconButton>
            <IconButton 
              variant="text" 
              className={`transition-colors duration-300 ${
                isScrolling ? "text-gray-700 dark:text-gray-300" : "text-white"
              }`}
              size="sm"
            >
              <i className="fa-brands fa-linkedin text-base" />
            </IconButton>
            <IconButton 
              variant="text" 
              className={`transition-colors duration-300 ${
                isScrolling ? "text-gray-700 dark:text-gray-300" : "text-white"
              }`}
              size="sm"
            >
              <i className="fa-brands fa-twitter text-base" />
            </IconButton>
            {/* <ThemeToggle /> */}
            {/* <Button 
              className={`ml-auto transition-all duration-300 ${
                isScrolling 
                  ? "btn-primary" 
                  : "bg-white hover:bg-gray-100 text-gray-900"
              }`}
              size="sm"
            >
              Hire Me
            </Button> */}
          </div>
        </div>
      </Collapse>
    </MTNavbar>
  );
}

export default Navbar;
