import { FaDiscord, FaTwitter, FaYoutube, FaMedium } from "react-icons/fa";

const socialLinks = [
  { href: "https://discord.gg/cRZ9gsC3", icon: <FaDiscord /> },
  { href: "https://twitter.com", icon: <FaTwitter /> },
  { href: "https://youtube.com", icon: <FaYoutube /> },
];

const Footer = () => {
  return (
    <footer className="w-screen py-4 md:py-5 text-white bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 border-t border-blue-700/30">
      <div className="container mx-auto flex flex-col items-center justify-between gap-3 md:gap-4 px-4 md:flex-row">
        <p className="text-center text-xs md:text-sm font-light md:text-left text-blue-100">
          ©CYSCOM 2026.
        </p>

        <div className="flex justify-center gap-3 md:gap-4">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-100 transition-all duration-300 ease-in-out hover:scale-110 hover:text-blue-300 text-lg md:text-xl">
            
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
