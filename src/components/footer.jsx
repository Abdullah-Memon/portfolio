"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Typography, IconButton, Button } from "@material-tailwind/react";
import { usePrimaryColor } from "@/hooks/usePrimaryColor";

const NAVIGATION_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Posts", href: "/posts" },
  { name: "Contact", href: "/contact" }
];

const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  const [profile, setProfile] = useState(null);
  const { getTextColorClass, getBgColorClass } = usePrimaryColor();

  useEffect(() => {
    // Fetch profile data for footer
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        }
      } catch (error) {
        console.error('Failed to fetch profile for footer:', error);
      }
    };

    fetchProfile();
  }, []);

  const profileData = profile || {
    name: "Abdullah Memon",
    title: "Full Stack Developer",
    bio: "Passionate developer creating amazing digital experiences with modern technologies.",
    email: "contact@abdullahmemon.dev",
    linkedin: "https://linkedin.com/in/abdullahmemon",
    github: "https://github.com/abdullahmemon",
    twitter: "https://twitter.com/abdullahmemon",
    instagram: "https://instagram.com/abdullahmemon"
  };

  return (
    <footer className={`mt-16 ${getBgColorClass()} text-white`}>
      <div className="container mx-auto px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <Typography variant="h4" color="white" className="mb-4 font-bold">
                {profileData.name.split(' ')[0]}
              </Typography>
            </Link>
            <Typography color="white" className="mb-6 font-normal opacity-90 max-w-md">
              {profileData.bio}
            </Typography>
            
            {/* Social Media Links */}
            <div className="flex gap-3 mb-6">
              {profileData.github && (
                <IconButton
                  variant="text"
                  color="white"
                  className="hover:bg-white/10 transition-all duration-300"
                  as="a"
                  href={profileData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-github text-xl"></i>
                </IconButton>
              )}
              {profileData.linkedin && (
                <IconButton
                  variant="text"
                  color="white"
                  className="hover:bg-white/10 transition-all duration-300"
                  as="a"
                  href={profileData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-linkedin text-xl"></i>
                </IconButton>
              )}
              {profileData.twitter && (
                <IconButton
                  variant="text"
                  color="white"
                  className="hover:bg-white/10 transition-all duration-300"
                  as="a"
                  href={profileData.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-twitter text-xl"></i>
                </IconButton>
              )}
              {profileData.instagram && (
                <IconButton
                  variant="text"
                  color="white"
                  className="hover:bg-white/10 transition-all duration-300"
                  as="a"
                  href={profileData.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-instagram text-xl"></i>
                </IconButton>
              )}
            </div>

            {/* Contact Email */}
            <div className="flex items-center gap-2 text-white/80">
              <i className="fa-solid fa-envelope text-sm"></i>
              <Typography as="a" href={`mailto:${profileData.email}`} className="text-sm hover:text-white transition-colors">
                {profileData.email}
              </Typography>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <Typography variant="h6" color="white" className="mb-4 font-semibold">
              Quick Links
            </Typography>
            <ul className="space-y-2">
              {NAVIGATION_LINKS.map((link) => (
                <li key={link.name}>
                  <Typography
                    as={Link}
                    href={link.href}
                    color="white"
                    className="text-sm opacity-80 hover:opacity-100 transition-opacity duration-300 block py-1"
                  >
                    {link.name}
                  </Typography>
                </li>
              ))}
            </ul>
          </div>

          {/* Services/Skills */}
          <div>
            <Typography variant="h6" color="white" className="mb-4 font-semibold">
              Services
            </Typography>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="py-1">Web Development</li>
              <li className="py-1">Mobile Apps</li>
              <li className="py-1">UI/UX Design</li>
              <li className="py-1">API Development</li>
              <li className="py-1">Database Design</li>
              <li className="py-1">Consulting</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <Button
            variant="outlined"
            color="white"
            className="flex items-center justify-center gap-2 hover:bg-white hover:text-gray-900 transition-all duration-300"
            as="a"
            href="/Abdullah Memon.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-solid fa-download text-sm"></i>
            Download Resume
          </Button>
          <Button
            variant="filled"
            color="white"
            className="flex items-center justify-center gap-2 text-gray-900 hover:bg-gray-100 transition-all duration-300"
            as={Link}
            href="/contact"
          >
            <i className="fa-solid fa-envelope text-sm"></i>
            Get In Touch
          </Button>
        </div>

        {/* Divider */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <Typography color="white" className="text-sm opacity-75 text-center md:text-left">
              &copy; {CURRENT_YEAR} {profileData.name}. All rights reserved.
            </Typography>

            {/* Additional Links
            <div className="flex items-center gap-6 text-sm text-white/75">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div> */}
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
