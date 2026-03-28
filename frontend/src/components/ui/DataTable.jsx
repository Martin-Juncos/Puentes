export const DataTable = ({ columns, rows, emptyText = 'Todavía no hay registros.' }) => {
  if (!rows?.length) {
    return (
      <div className="rounded-3xl border border-dashed border-[rgba(47,93,115,0.2)] p-8 text-sm text-[rgba(46,46,46,0.66)]">
        {emptyText}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-[rgba(47,93,115,0.1)]">
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
            <tr key={row.id ?? rowIndex}>
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 align-top text-[rgba(46,46,46,0.84)]">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
