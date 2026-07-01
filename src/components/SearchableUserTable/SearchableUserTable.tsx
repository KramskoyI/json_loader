import "./SearchableUserTable.css";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import type { UserRecord } from "../../types/data";
import { Input, VirtualTable } from "../shared";
import { renderHighlightedText } from "./lib/highlight";
import { matchesQuery } from "./lib/search";

type SearchableUserTableProps = {
  data: UserRecord[];
};

export function SearchableUserTable({ data }: SearchableUserTableProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 500);
  const normalizedQuery = debouncedQuery.trim().toLowerCase();

  function renderCellValue(value: string | number) {
    const textValue = String(value);

    return renderHighlightedText(textValue, normalizedQuery);
  }

  const columns = useMemo<ColumnDef<UserRecord>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => renderCellValue(row.original.id),
      },
      {
        accessorKey: "fullName",
        header: "Name",
        cell: ({ row }) => renderCellValue(row.original.fullName),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => renderCellValue(row.original.email),
      },
      {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => renderCellValue(row.original.phone),
      },
      {
        accessorKey: "country",
        header: "Country",
        cell: ({ row }) => renderCellValue(row.original.country),
      },
      {
        accessorKey: "city",
        header: "City",
        cell: ({ row }) => renderCellValue(row.original.city),
      },
      {
        accessorKey: "age",
        header: "Age",
        cell: ({ row }) => renderCellValue(row.original.age),
      },
      {
        accessorKey: "nationality",
        header: "Nationality",
        cell: ({ row }) => renderCellValue(row.original.nationality),
      },
    ],
    [normalizedQuery],
  );

  const filteredData = useMemo(
    () =>
      normalizedQuery === ""
        ? data
        : data.filter((row) => matchesQuery(row, normalizedQuery)),
    [data, normalizedQuery],
  );

  return (
    <div className="ui-searchable">
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search in table"
      />
      <VirtualTable
        columns={columns}
        data={filteredData}
        emptyText={normalizedQuery === "" ? "No data" : "No matches found"}
      />
    </div>
  );
}
