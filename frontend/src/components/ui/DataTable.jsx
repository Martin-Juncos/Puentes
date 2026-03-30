import { EmptyState } from '@/components/ui/EmptyState'
import { cn } from '@/utils/cn'

const resolveCellContent = (column, row) => (column.render ? column.render(row) : row[column.key])

export const DataTable = ({
  columns,
  rows,
  emptyText = 'Todavía no hay registros.',
  onRowClick,
  getRowClassName,
}) => {
  if (!rows?.length) {
    return <EmptyState description={emptyText} title="No hay datos para mostrar" />
  }

  const primaryColumn = columns[0]

  return (
    <>
      <div className="table-shell hidden overflow-x-auto md:block">
        <table className="min-w-full divide-y divide-[rgba(47,93,115,0.08)] text-sm">
          <thead className="bg-[rgba(47,93,115,0.05)] text-left text-[var(--color-primary)]">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 font-semibold">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(47,93,115,0.06)] bg-white">
            {rows.map((row, rowIndex) => (
              <tr
                key={row.id ?? rowIndex}
                className={cn(
                  onRowClick ? 'cursor-pointer transition-colors hover:bg-[rgba(47,93,115,0.04)]' : '',
                  getRowClassName?.(row),
                )}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 align-top text-[rgba(46,46,46,0.84)]">
                    {resolveCellContent(column, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 md:hidden">
        {rows.map((row, rowIndex) => (
          <article
            key={row.id ?? rowIndex}
            className={cn(
              'table-mobile-card',
              onRowClick ? 'cursor-pointer transition-colors hover:bg-[rgba(247,244,238,0.96)]' : '',
              getRowClassName?.(row),
            )}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
          >
            <div className="table-mobile-card__title">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgba(47,93,115,0.58)]">
                {primaryColumn?.label}
              </p>
              <div className="mt-1 text-base font-semibold text-[var(--color-primary)]">
                {primaryColumn ? resolveCellContent(primaryColumn, row) : row.id ?? rowIndex}
              </div>
            </div>

            <dl className="mt-4 grid gap-3">
              {columns.slice(1).map((column) => (
                <div key={column.key}>
                  <dt>{column.label}</dt>
                  <dd>{resolveCellContent(column, row)}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </>
  )
}
