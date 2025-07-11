import { Link, useLocation } from "react-router-dom";

const MobileFooter = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const getLinkClass = (path: string) => {
    return isActive(path) 
      ? "font-medium transition-colors" 
      : "text-gray-600 hover:text-gray-900 transition-colors font-medium";
  };

  const getLinkStyle = (path: string) => {
    return isActive(path) ? { color: '#00bf63' } : {};
  };

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg">
        <div className="px-4 py-3">
          <div className="flex justify-center space-x-6 text-sm">
            <Link 
              to="/" 
              className={getLinkClass("/")}
              style={getLinkStyle("/")}
            >
              Home
            </Link>
            <Link 
              to="/results" 
              className={getLinkClass("/results")}
              style={getLinkStyle("/results")}
            >
              Results
            </Link>
            <Link 
              to="/about" 
              className={getLinkClass("/about")}
              style={getLinkStyle("/about")}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={getLinkClass("/contact")}
              style={getLinkStyle("/contact")}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFooter;