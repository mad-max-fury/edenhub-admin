import ReactPaginate from "react-paginate";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Or your icon library

interface PaginationElementProps {
  page: number; // Current page (1-indexed from your backend)
  total: number; // Total number of pages
  onChange: (page: number) => void;
}

export function PaginationElement({
  page,
  total,
  onChange,
}: PaginationElementProps) {
  // If there's only one page or none, don't show pagination
  if (total <= 1) return null;

  const handlePageClick = (event: { selected: number }) => {
    // react-paginate is 0-indexed, so we add 1 for your backend logic
    onChange(event.selected + 1);
  };

  return (
    <div className="flex justify-center py-4">
      <ReactPaginate
        breakLabel="..."
        nextLabel={
          <div className="flex items-center gap-1 px-2 py-1 rounded hover:bg-N20 transition-colors">
            <span className="hidden sm:inline text-sm">Next</span>
            <ChevronRight size={18} />
          </div>
        }
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        pageCount={total}
        forcePage={page - 1} // Sync with 1-indexed state
        previousLabel={
          <div className="flex items-center gap-1 px-2 py-1 rounded hover:bg-N20 transition-colors">
            <ChevronLeft size={18} />
            <span className="hidden sm:inline text-sm">Previous</span>
          </div>
        }
        renderOnZeroPageCount={null}
        // Tailwind Styling
        containerClassName="flex items-center gap-2 list-none"
        pageClassName="block"
        pageLinkClassName="px-3 py-1.5 rounded-md border border-N30 text-sm font-medium hover:bg-N10 transition-colors cursor-pointer"
        activeLinkClassName="bg-primary-600 !border-primary-600 text-white hover:bg-primary-700"
        breakLinkClassName="px-3 py-1.5 text-N300"
        disabledClassName="opacity-40 cursor-not-allowed"
      />
    </div>
  );
}
