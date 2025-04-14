
import { Link } from "react-router-dom";
import { AuthButton } from "@/components/AuthButton";

const MenuBar = () => {
  return (
    <nav className="fixed w-full z-50 bg-gradient-to-br from-emerald-50/80 via-blue-50/80 to-emerald-50/80 backdrop-blur-md border-b border-emerald-100/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/9f030b65-074a-4e64-82d9-f0eba7246e1a.png" 
              alt="Milk Me Not Logo" 
              className="h-12 w-12" 
            />
            <span className="text-gray-800 text-5xl font-bold">Milk Me Not</span>
          </Link>
          
          <div className="flex items-center gap-8">
            <Link 
              to="/results" 
              className="text-gray-700 hover:text-emerald-600 transition-colors text-lg font-medium"
            >
              Results
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-emerald-600 transition-colors text-lg font-medium"
            >
              About
            </Link>
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MenuBar;
