import { useEffect, useState } from 'react';

const initialForm = { nama: '', stok: '0', kategori_id: '' };

export default function FormBarang({ barangEdit, kategori, onSubmit, onCancel, saving }) {
  const [form, setForm] = useState(initialForm);
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    if (barangEdit) {
      setForm({
        nama: barangEdit.nama,
        stok: String(barangEdit.stok),
        kategori_id: String(barangEdit.kategori_id)
      });
    } else {
      setForm(initialForm);
    }
    setValidationMessage('');
  }, [barangEdit]);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setValidationMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const stok = Number(form.stok);
    if (!form.nama.trim()) {
      setValidationMessage('Nama barang wajib diisi.');
      return;
    }
    if (!Number.isInteger(stok) || stok < 0) {
      setValidationMessage('Stok harus berupa bilangan bulat minimal 0.');
      return;
    }
    if (!form.kategori_id) {
      setValidationMessage('Silakan pilih kategori barang.');
      return;
    }

    setValidationMessage('');
    await onSubmit({
      nama: form.nama.trim(),
      stok,
      kategori_id: Number(form.kategori_id)
    });
    if (!barangEdit) setForm(initialForm);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          {barangEdit ? 'Perbarui data' : 'Data barang'}
        </p>
        <h2 className="mt-1 text-xl font-bold text-slate-900">
          {barangEdit ? 'Edit barang' : 'Tambah barang'}
        </h2>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="nama" className="mb-1.5 block text-sm font-medium text-slate-700">
            Nama barang
          </label>
          <input
            id="nama"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            maxLength={150}
            placeholder="Contoh: Keyboard wireless"
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label htmlFor="stok" className="mb-1.5 block text-sm font-medium text-slate-700">
            Jumlah stok
          </label>
          <input
            id="stok"
            name="stok"
            type="number"
            min="0"
            step="1"
            value={form.stok}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label htmlFor="kategori_id" className="mb-1.5 block text-sm font-medium text-slate-700">
            Kategori
          </label>
          <select
            id="kategori_id"
            name="kategori_id"
            value={form.kategori_id}
            onChange={handleChange}
            disabled={kategori.length === 0}
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:bg-slate-100"
          >
            <option value="">Pilih kategori</option>
            {kategori.map((item) => (
              <option key={item.id} value={item.id}>{item.nama}</option>
            ))}
          </select>
          {kategori.length === 0 && (
            <p className="mt-1.5 text-xs text-amber-700">Kategori belum tersedia. Periksa data kategori di database.</p>
          )}
        </div>

        {validationMessage && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {validationMessage}
          </p>
        )}

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={saving || kategori.length === 0}
            className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Menyimpan...' : barangEdit ? 'Simpan perubahan' : 'Tambah barang'}
          </button>
          {barangEdit && (
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="rounded-xl border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Batal
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
