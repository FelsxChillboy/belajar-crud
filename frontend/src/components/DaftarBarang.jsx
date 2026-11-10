export default function DaftarBarang({ barang, loading, error, onEdit, onDelete }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-1 border-b border-slate-200 px-5 py-5 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Inventaris</p>
        <h2 className="text-xl font-bold text-slate-900">Daftar barang</h2>
      </div>

      {loading ? (
        <div className="px-6 py-12 text-center text-slate-500" role="status">Memuat data barang...</div>
      ) : error ? (
        <div className="m-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</div>
      ) : barang.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="font-semibold text-slate-700">Belum ada barang</p>
          <p className="mt-1 text-sm text-slate-500">Tambahkan barang pertama melalui formulir.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-3.5 font-semibold">Nama barang</th>
                <th className="px-6 py-3.5 font-semibold">Kategori</th>
                <th className="px-6 py-3.5 font-semibold">Stok</th>
                <th className="px-6 py-3.5 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {barang.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70">
                  <td className="px-6 py-4 font-medium text-slate-900">{item.nama}</td>
                  <td className="px-6 py-4 text-slate-600">{item.nama_kategori}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                      item.stok < 5
                        ? 'bg-red-100 text-red-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {item.stok < 5 ? 'Stok rendah' : 'Aman'} · {item.stok}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="rounded-lg px-3 py-1.5 font-medium text-indigo-700 hover:bg-indigo-50"
                        aria-label={`Edit ${item.nama}`}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        className="rounded-lg px-3 py-1.5 font-medium text-red-700 hover:bg-red-50"
                        aria-label={`Hapus ${item.nama}`}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!loading && !error && barang.length > 0 && (
        <div className="border-t border-slate-100 px-6 py-3 text-xs text-slate-500">
          {barang.length} barang terdaftar
        </div>
      )}
    </section>
  );
}
