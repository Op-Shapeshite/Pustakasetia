import { X } from 'lucide-react';
import { useEffect } from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function MobileMenu({ isOpen, onClose, currentPage, onNavigate }: MobileMenuProps) {
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleNavigate = (page: string) => {
    onNavigate(page);
    onClose();
  };

  const menuItems = [
    { label: 'Beranda', page: 'home' },
    { label: 'Tentang Kami', page: 'about' },
    { label: 'Produk', page: 'products' },
    { label: 'Kontak', page: 'contact' },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />

      {/* Slide-in Menu */}
      <div className={`
        fixed top-0 right-0 bottom-0 w-[280px] bg-white z-50 
        transform transition-transform duration-300 ease-in-out
        md:hidden
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">Menu</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-neutral-700" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = currentPage === item.page;
              
              return (
                <li key={item.page}>
                  <button
                    onClick={() => handleNavigate(item.page)}
                    className={`
                      w-full text-left px-4 py-3 rounded-lg font-medium
                      transition-colors
                      ${isActive 
                        ? 'bg-yellow-400 text-neutral-900' 
                        : 'text-neutral-700 hover:bg-neutral-100'
                      }
                    `}
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
