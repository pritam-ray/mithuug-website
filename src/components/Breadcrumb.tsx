import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
}

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Don't show breadcrumb on homepage
  if (location.pathname === '/') {
    return null;
  }

  // Generate breadcrumb items
  const breadcrumbs: BreadcrumbItem[] = pathnames.map((path, index) => {
    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
    const label = path
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return { label, path: routeTo };
  });

  return (
    <nav className="bg-ivory-50 border-b border-ochre-100 py-3">
      <div className="max-w-7xl mx-auto px-4">
        <ol className="flex items-center space-x-2 text-sm">
          {/* Home Link */}
          <li>
            <Link
              to="/"
              className="flex items-center text-chocolate-600 hover:text-ochre-600 transition-colors"
            >
              <Home className="w-4 h-4" />
            </Link>
          </li>

          {/* Breadcrumb Items */}
          {breadcrumbs.map((breadcrumb, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <li key={breadcrumb.path} className="flex items-center space-x-2">
                <ChevronRight className="w-4 h-4 text-chocolate-400" />
                {isLast ? (
                  <span className="text-chocolate-900 font-medium">
                    {breadcrumb.label}
                  </span>
                ) : (
                  <Link
                    to={breadcrumb.path}
                    className="text-chocolate-600 hover:text-ochre-600 transition-colors"
                  >
                    {breadcrumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumb;
