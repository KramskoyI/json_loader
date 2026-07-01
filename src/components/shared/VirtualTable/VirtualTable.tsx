import './VirtualTable.css';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

type VirtualTableProps<TData extends object> = {
  columns: ColumnDef<TData>[];
  data: TData[];
  emptyText?: string;
  height?: number;
  rowHeight?: number;
};

export function VirtualTable<TData extends object>({
  columns,
  data,
  emptyText = 'No data',
  height = 780,
  rowHeight = 36,
}: VirtualTableProps<TData>) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;
  const leafColumns = table.getAllLeafColumns();
  const gridTemplateColumns = `repeat(${leafColumns.length}, minmax(140px, 1fr))`;

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => rowHeight,
    getScrollElement: () => scrollRef.current,
    overscan: 8,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  if (rows.length === 0) {
    return <div className="table__empty">{emptyText}</div>;
  }

  return (
    <div className="table">
      <div
        ref={scrollRef}
        className="table__scroll"
        style={{ height: `${height}px`, overflow: 'auto' }}
      >
        <div className="table__head">
          {table.getHeaderGroups().map((headerGroup) => (
            <div
              key={headerGroup.id}
              className="table__head-row"
              style={{ gridTemplateColumns }}
            >
              {headerGroup.headers.map((header) => (
                <div key={header.id} className="table__head-cell">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div
          className="table__body"
          style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
        >
          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index];

            return (
              <div
                key={row.id}
                className="table__row"
                style={{
                  gridTemplateColumns,
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <div key={cell.id} className="table__cell">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
