import { motion } from 'motion/react';
import { Button } from './button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = ""
}: TablePaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Génère les numéros de pages à afficher
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Si moins de 5 pages, afficher toutes
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logique pour afficher les pages avec ellipses
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 p-4 border-t bg-white ${className}`}
    >
      {/* Indicateur de lignes */}
      <div className="text-sm text-muted-foreground">
        Affiche <span className="font-medium">{startItem}–{endItem}</span> sur{' '}
        <span className="font-medium">{totalItems}</span> résultats
      </div>

      {/* Contrôles de pagination */}
      <div className="flex items-center space-x-2">
        {/* Bouton Précédent */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-9 px-3 transition-all hover:bg-blue-50 disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Précédent
        </Button>

        {/* Numéros de pages */}
        <div className="flex items-center space-x-1">
          {pageNumbers.map((page, index) => (
            <motion.div
              key={`page-${page}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
            >
              {page === '...' ? (
                <div className="flex items-center justify-center w-9 h-9">
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </div>
              ) : (
                <Button
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page as number)}
                  className={`w-9 h-9 p-0 transition-all ${
                    currentPage === page
                      ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                      : 'hover:bg-blue-50 border-gray-200'
                  }`}
                >
                  {page}
                </Button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bouton Suivant */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-9 px-3 transition-all hover:bg-blue-50 disabled:opacity-50"
        >
          Suivant
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </motion.div>
  );
}