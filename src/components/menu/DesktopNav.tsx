import { Link } from "react-router-dom";

interface DesktopNavProps {
  pathname: string;
}

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/feed', label: 'Feed' },
  { path: '/results', label: 'Results' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
];

export const DesktopNav = ({ pathname }: DesktopNavProps) => {
  return (
    <div className="hidden lg:flex items-center gap-6">
      {navItems.map(({ path, label }) => (
        <Link
          key={path}
          to={path}
          className={`transition-colors ${
            pathname === path
              ? 'text-primary font-medium'
              : 'text-foreground/70 hover:text-foreground'
          }`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
};
