
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface NavigationProps {
  currentPath?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPath }) => {
  // Simple breadcrumb navigation
  const pathSegments = currentPath 
    ? currentPath.split('/').filter(Boolean)
    : window.location.pathname.split('/').filter(Boolean);

  return (
    <nav className="flex items-center mb-4 text-sm">
      <Link to="/" className="text-gray-500 hover:text-gray-800 transition-colors">
        Home
      </Link>
      
      {pathSegments.map((segment, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />
          <span className={index === pathSegments.length - 1 ? "text-gray-800 font-medium" : "text-gray-500"}>
            {segment.charAt(0).toUpperCase() + segment.slice(1)}
          </span>
        </React.Fragment>
      ))}
    </nav>
  );
};
