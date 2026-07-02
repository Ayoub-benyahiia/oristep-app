import { NavLink } from 'react-router-dom';
import { Home, Compass, Bookmark, Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/browse', icon: Compass, label: 'Browse' },
  { to: '/projects', icon: Bookmark, label: 'Projects' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function BottomNav() {

  return (
    <div className="absolute bottom-0 w-full z-50 px-4 pb-safe pt-2 bg-gradient-to-t from-paper-light via-paper-light to-paper-light/80 backdrop-blur-lg border-t border-crease-light">
      <nav className="flex items-center justify-around max-w-md mx-auto h-16 relative">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                "relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-300",
                isActive ? "text-accent" : "text-ink-light hover:text-ink"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <item.icon className={cn("w-6 h-6", isActive && "stroke-[2.5px]")} />
                  {isActive && (
                    <motion.div
                      layoutId="bottom-nav-indicator"
                      className="absolute -top-3 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                  )}
                </div>
                <span className="text-[10px] font-bold tracking-widest uppercase">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
