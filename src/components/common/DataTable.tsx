import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { ChangeEvent, ReactNode, useCallback, useMemo, useState } from "react";
import EmptyState from "./EmptyState";

export interface Column<T> {
  /** Unique key for the column — also used as the sort key */
  id: string;
  label: string;
  /** If false, column cannot be sorted */
  sortable?: boolean;
  /** Min width in px */
  minWidth?: number;
  /** Alignment */
  align?: "left" | "center" | "right";
  /** Custom cell renderer */
  render?: (row: T, index: number) => ReactNode;
}

type SortDirection = "asc" | "desc";

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  rows: T[];
  /** Unique key extractor for each row */
  getRowId: (row: T) => string | number;
  /** Enable row selection checkboxes */
  selectable?: boolean;
  selectedIds?: (string | number)[];
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
  /** Default sort column id */
  defaultSortBy?: string;
  defaultSortDir?: SortDirection;
  /** Rows per page options */
  rowsPerPageOptions?: number[];
  /** Empty state message */
  emptyMessage?: string;
  /** Disable internal pagination (for server-side pagination) */
  disablePagination?: boolean;
  loading?: boolean;
  /** Total row count for server-side pagination */
  totalCount?: number;
  page?: number;
  rowsPerPage?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  onSortChange?: (sortBy: string, sortDir: SortDirection) => void;
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  getRowId,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  defaultSortBy,
  defaultSortDir = "asc",
  loading = false,
  rowsPerPageOptions = [5, 10, 25],
  emptyMessage = "No records to display",
  disablePagination = false,
  totalCount,
  page: controlledPage,
  rowsPerPage: controlledRowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onSortChange,
}: DataTableProps<T>) {
  const [sortBy, setSortBy] = useState(defaultSortBy ?? "");
  const [sortDir, setSortDir] = useState<SortDirection>(defaultSortDir);
  const [internalPage, setInternalPage] = useState(0);
  const [internalRowsPerPage, setInternalRowsPerPage] = useState(
    rowsPerPageOptions[0] ?? 10
  );

  const page = controlledPage ?? internalPage;
  const rowsPerPage = controlledRowsPerPage ?? internalRowsPerPage;

  // --- Sorting ---
  const handleSort = useCallback(
    (columnId: string) => {
      const isAsc = sortBy === columnId && sortDir === "asc";
      const newDir: SortDirection = isAsc ? "desc" : "asc";
      setSortBy(columnId);
      setSortDir(newDir);
      onSortChange?.(columnId, newDir);
    },
    [sortBy, sortDir, onSortChange]
  );

  const sortedRows = useMemo(() => {
    if (!sortBy || onSortChange) return rows; // skip client sort if server-side
    return [...rows].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [rows, sortBy, sortDir, onSortChange]);

  // --- Pagination ---
  const paginatedRows = useMemo(() => {
    if (disablePagination || onPageChange) return sortedRows; // server-side
    return sortedRows.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [sortedRows, page, rowsPerPage, disablePagination, onPageChange]);

  const handlePageChange = useCallback(
    (_: unknown, newPage: number) => {
      if (onPageChange) {
        onPageChange(newPage);
      } else {
        setInternalPage(newPage);
      }
    },
    [onPageChange]
  );

  const handleRowsPerPageChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      if (onRowsPerPageChange) {
        onRowsPerPageChange(value);
      } else {
        setInternalRowsPerPage(value);
        setInternalPage(0);
      }
    },
    [onRowsPerPageChange]
  );

  // --- Selection ---
  const allVisibleIds = paginatedRows.map(getRowId);
  const isAllSelected =
    allVisibleIds.length > 0 &&
    allVisibleIds.every((id) => selectedIds.includes(id));
  const isSomeSelected =
    allVisibleIds.some((id) => selectedIds.includes(id)) && !isAllSelected;

  const handleSelectAll = useCallback(() => {
    if (!onSelectionChange) return;
    if (isAllSelected) {
      onSelectionChange(
        selectedIds.filter((id) => !allVisibleIds.includes(id))
      );
    } else {
      const merged = new Set([...selectedIds, ...allVisibleIds]);
      onSelectionChange(Array.from(merged));
    }
  }, [isAllSelected, selectedIds, allVisibleIds, onSelectionChange]);

  const handleSelectRow = useCallback(
    (rowId: string | number) => {
      if (!onSelectionChange) return;
      if (selectedIds.includes(rowId)) {
        onSelectionChange(selectedIds.filter((id) => id !== rowId));
      } else {
        onSelectionChange([...selectedIds, rowId]);
      }
    },
    [selectedIds, onSelectionChange]
  );

  if (!loading && rows.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <Paper
      variant="outlined"
      sx={{ borderRadius: 2, overflow: "hidden", borderColor: "grey.200" }}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.50" }}>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={isSomeSelected}
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    size="small"
                  />
                </TableCell>
              )}

              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align ?? "left"}
                  sx={{
                    minWidth: col.minWidth,
                    fontWeight: 600,
                    fontSize: "0.82rem",
                    color: "text.secondary",
                  }}
                >
                  {col.sortable !== false ? (
                    <TableSortLabel
                      active={sortBy === col.id}
                      direction={sortBy === col.id ? sortDir : "asc"}
                      onClick={() => handleSort(col.id)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading
              ? Array.from(new Array(rowsPerPage || 5)).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Skeleton variant="circular" width={20} height={20} />
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell key={col.id} align={col.align ?? "left"}>
                      <Skeleton variant="rounded" width="100%" height={20} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
              : paginatedRows.map((row, index) => {
                const rowId = getRowId(row);
                const isSelected = selectedIds.includes(rowId);

                return (
                  <TableRow
                    key={rowId}
                    hover
                    selected={isSelected}
                    sx={{
                      "&:last-child td": { borderBottom: 0 },
                      cursor: selectable ? "pointer" : "default",
                    }}
                    onClick={
                      selectable ? () => handleSelectRow(rowId) : undefined
                    }
                  >
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} size="small" />
                      </TableCell>
                    )}

                    {columns.map((col) => (
                      <TableCell key={col.id} align={col.align ?? "left"}>
                        {col.render
                          ? col.render(row, index)
                          : (row[col.id] as ReactNode) ?? "—"}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      {!disablePagination && (
        <TablePagination
          component="div"
          count={totalCount ?? rows.length}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={rowsPerPageOptions}
        />
      )}
    </Paper>
  );
}
