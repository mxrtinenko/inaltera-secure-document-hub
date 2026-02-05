import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/Logo';
import {
  Building2,
  FileText,
  ClipboardList,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  {
    to: '/perfil',
    icon: Building2,
    label: 'Datos de la Empresa',
    sublabel: 'y Tarifas',
  },
  {
    to: '/facturacion',
    icon: FileText,
    label: 'Facturación',
    sublabel: 'y Carga',
  },
  {
    to: '/registro-facturas',
    icon: ClipboardList,
    label: 'Registro',
    sublabel: 'de Facturas',
  },
];

const AppSidebar: React.FC<AppSidebarProps> = ({ collapsed, onToggle }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: 'Sesión cerrada',
      description: 'Has cerrado sesión correctamente',
    });
    navigate('/login');
  };

  return (
    <aside
      className={cn(
        'bg-sidebar h-screen flex flex-col border-r border-sidebar-border transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      {/* Header */}
      <div className={cn(
        'p-4 border-b border-sidebar-border flex items-center',
        collapsed ? 'justify-center' : 'justify-between'
      )}>
        <Logo size={collapsed ? 'sm' : 'md'} showText={!collapsed} />
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn(
            'text-sidebar-foreground hover:bg-sidebar-accent',
            collapsed && 'hidden md:flex'
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'sidebar-nav-item',
                isActive && 'active',
                collapsed && 'justify-center px-2'
              )
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-xs opacity-70">{item.sublabel}</span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-sidebar-border">
        {!collapsed && user && (
          <div className="px-3 py-2 mb-2">
            <p className="text-xs text-sidebar-foreground/60">Conectado como</p>
            <p className="text-sm text-sidebar-foreground truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            'sidebar-nav-item w-full text-destructive hover:bg-destructive/10',
            collapsed && 'justify-center px-2'
          )}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="text-sm">Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;