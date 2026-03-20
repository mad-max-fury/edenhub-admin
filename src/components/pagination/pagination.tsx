import { Pagination } from "@mantine/core";

interface PaginationElementProps {
  page: number;
  total: number;
  onChange: (page: number) => void;
}

export function PaginationElement({
  page,
  total,
  onChange,
}: PaginationElementProps) {
  if (total <= 1) return null;

  return (
    <div className="flex justify-center">
      <Pagination
        value={page}
        onChange={onChange}
        total={total}
        radius="md"
        size="md"
        withEdges
        siblings={1}
      />
    </div>
  );
}
