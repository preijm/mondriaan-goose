
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ChartPie, Table, PlusCircle, Info, User, Menu, X } from "lucide-react";
import { AuthButton } from "./AuthButton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export const Navigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const links = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/dashboard", icon: ChartPie, label: "Dashboard" },
    { to: "/results", icon: Table, label: "Results" },
    ...(session ? [
      { to: "/add", icon: PlusCircle, label: "Add Test" },
      { to: "/my-results", icon: User, label: "My Results" }
    ] : []),
    { to: "/about", icon: Info, label: "About" },
  ];

  const currentPage = links.find(link => link.to === location.pathname)?.label || "";

  const linkClasses = (isActive: boolean) => cn(`
    flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 
    hover:shadow-lg
    ${isActive 
      ? "bg-green-400/80 text-white hover:bg-green-400/90" 
      : "bg-white/80 text-gray-700 hover:bg-blue-50"
    }
  `);

  return (
    <nav className="bg-white/40 backdrop-blur-md rounded-lg shadow-lg p-4 mb-8 border border-white/20">
      {isMobile ? (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <CollapsibleTrigger className="p-2 hover:bg-gray-100/50 rounded-md transition-colors">
                {isOpen ? (
                  <X className="h-6 w-6 text-gray-700" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-700" />
                )}
              </CollapsibleTrigger>
              <span className="text-gray-700 font-medium">{currentPage}</span>
            </div>
            <AuthButton />
          </div>
          <CollapsibleContent>
            <div className="flex flex-col gap-2">
              {links.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={linkClasses(location.pathname === to)}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {links.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className={linkClasses(location.pathname === to)}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
          <AuthButton />
        </div>
      )}
    </nav>
  );
};
