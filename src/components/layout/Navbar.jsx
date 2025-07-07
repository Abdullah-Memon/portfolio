'use client';

import React from "react";
import Link from "next/link";
import {
  Navbar as MTNavbar,
  Collapse,
  IconButton,
  Typography,
  Button,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
// import ThemeToggle from "@/components/ui/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { usePrimaryColor } from "@/hooks/usePrimaryColor";

function NavItem({ children, href }) {
  const { getHoverTextColorClass } = usePrimaryColor();
  
  return (
    <li>
      <Typography
        as={Link}
        href={href || "#"}
        variant="small"
        className={`font-medium transition-colors ${getHoverTextColorClass()}`}
      >
        {children}
      </Typography>
    </li>
  );
}

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const [isScrolling, setIsScrolling] = React.useState(false);
  // const { isDark } = useTheme(); // Removed - always light mode
  const { getMaterialTailwindColor, getHoverTextColorClass } = usePrimaryColor();
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
      if (window.scrollY > 0) {
        setIsScrolling(true);
      } else {
        setIsScrolling(false);
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dynamic colors based on scroll (light mode only)
  const getNavbarColor = () => {
    if (isScrolling) {
      return "white"; // Always white background when scrolling
    }
    return "transparent";
  };

  const getTextColor = () => {
    if (isScrolling) {
      return "text-gray-900"; // Always dark text when scrolling
    }
    return "text-white";
  };

  const getIconColor = () => {
    if (isScrolling) {
      return "gray"; // Always gray icons when scrolling
    }
    return "white";
  };

  return (
    <MTNavbar
      fullWidth
      shadow={false}
      blurred={false}
      color={getNavbarColor()}
      className={`fixed top-0 z-50 border-0 transition-all duration-300 ${
        isScrolling 
          ? 'bg-white/95 backdrop-blur-sm border-b border-gray-200' // Always light background
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Typography
          as={Link}
          href="/"
          variant="h6"
          className={`font-bold transition-colors ${getTextColor()}`}
        >
          Abdullah
        </Typography>
        <ul
          className={`ml-10 hidden items-center gap-6 lg:flex ${getTextColor()}`}
        >
          <NavItem href="/">Home</NavItem>
          <NavItem href="/about">About</NavItem>
          <NavItem href="/posts">Posts</NavItem>
          <NavItem href="/contact">Contact</NavItem>
        </ul>
        <div className="hidden gap-2 lg:flex lg:items-center">
          <IconButton
            variant="text"
            color={getIconColor()}
            size="sm"
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <i className="fa-brands fa-github text-base" />
          </IconButton>
          <IconButton
            variant="text"
            color={getIconColor()}
            size="sm"
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <i className="fa-brands fa-linkedin text-base" />
          </IconButton>
          <IconButton
            variant="text"
            color={getIconColor()}
            size="sm"
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <i className="fa-brands fa-twitter text-base" />
          </IconButton>
          {/* <ThemeToggle className="mx-1" /> */}
          {/* <Button 
            as={Link}
            href="/contact" 
            color={isScrolling ? primaryColor : "white"}
            size="sm"
            className="ml-2"
          >
            Hire Me
          </Button> */}
        </div>
        <IconButton
          variant="text"
          color={getIconColor()}
          onClick={handleOpen}
          className="ml-auto inline-block lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {open ? (
            <XMarkIcon strokeWidth={2} className="h-6 w-6" />
          ) : (
            <Bars3Icon strokeWidth={2} className="h-6 w-6" />
          )}
        </IconButton>
      </div>
      <Collapse open={open}>
        <div className={`container mx-auto mt-4 rounded-lg border-t px-6 py-5 transition-colors border-gray-50 bg-white text-gray-900`}>
          <ul className="flex flex-col gap-4">
            <NavItem href="/">Home</NavItem>
            <NavItem href="/about">About</NavItem>
            <NavItem href="/posts">Posts</NavItem>
            <NavItem href="/contact">Contact</NavItem>
          </ul>
          <div className="mt-4 flex items-center gap-2">
            <IconButton 
              variant="text" 
              color="gray"
              size="sm"
              className="hover:bg-gray-100"
            >
              <i className="fa-brands fa-github text-base" />
            </IconButton>
            <IconButton 
              variant="text" 
              color="gray"
              size="sm"
              className="hover:bg-gray-100"
            >
              <i className="fa-brands fa-linkedin text-base" />
            </IconButton>
            <IconButton 
              variant="text" 
              color="gray"
              size="sm"
              className="hover:bg-gray-100"
            >
              <i className="fa-brands fa-twitter text-base" />
            </IconButton>
            {/* <ThemeToggle className="mx-1" /> */}
            {/* <Button 
              as={Link}
              href="/contact"
              color={primaryColor} 
              size="sm" 
              className="ml-auto"
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
