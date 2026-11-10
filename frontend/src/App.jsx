import { useState, useEffect } from "react";

export default function App() {
  const [barang, setBarang] = useState([]);
  const [nama, setNama] = useState("");
  const [stok, setStok] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // State baru untuk mode Edit[cite: 1]
  const [editId, setEditId] = useState(null); 

  const fetchBarang = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/barang");
      if (!res.ok) throw new Error("Gagal mengambil data dari server");
      setBarang(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarang();
  }, []);

  // Handler Submit digabung untuk Create (POST) dan Update (PUT)[cite: 1]
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    if (!nama.trim()) return alert("Nama wajib diisi");
    if (Number(stok) < 0) return alert("Stok tidak boleh negatif");

    try {
      if (editId) {
        // Jika editId ada, lakukan operasi UPDATE (PUT)[cite: 1]
        const res = await fetch(`http://localhost:3000/api/barang/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nama, stok: Number(stok) })
        });
        if (!res.ok) throw new Error("Gagal memperbarui barang");
      } else {
        // Jika editId kosong, lakukan operasi CREATE (POST)[cite: 1]
        const res = await fetch("http://localhost:3000/api/barang", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nama, stok: Number(stok) })
        });
        if (!res.ok) throw new Error("Gagal menyimpan barang");
      }
      
      // Reset form dan mode edit, lalu muat ulang daftar[cite: 1]
      setNama("");
      setStok("");
      setEditId(null);
      fetchBarang(); 
    } catch (err) {
      alert(err.message);
    }
  };

  // Fungsi untuk mengisi form dengan data yang mau diedit[cite: 1]
  const handleEditClick = (item) => {
    setNama(item.nama);
    setStok(item.stok);
    setEditId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Otomatis scroll ke atas
  };

  // Fungsi untuk membatalkan mode edit
  const cancelEdit = () => {
    setNama("");
    setStok("");
    setEditId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus barang ini?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/barang/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus barang");
      fetchBarang();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="p-8 text-center">Memuat data...</p>;
  if (error) return <p className="p-8 text-center text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-slate-800">Aplikasi Inventaris</h1>
        
        {/* Form berubah warna jika sedang mode edit */}
        <form onSubmit={handleSubmit} className={`mb-8 flex gap-4 items-end p-4 rounded-lg border ${editId ? 'bg-yellow-50 border-yellow-300' : 'bg-slate-50'}`}>
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1">Nama Barang</label>
            <input 
              type="text" 
              className="w-full border rounded p-2 focus:outline-blue-500" 
              value={nama} 
              onChange={e => setNama(e.target.value)} 
            />
          </div>
          <div className="w-32">
            <label className="block text-sm font-semibold mb-1">Stok</label>
            <input 
              type="number" 
              className="w-full border rounded p-2 focus:outline-blue-500" 
              value={stok} 
              onChange={e => setStok(e.target.value)} 
            />
          </div>
          <button type="submit" className={`${editId ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-6 py-2 rounded font-medium`}>
            {editId ? 'Update Data' : 'Simpan'}
          </button>
          
          {/* Tombol batal hanya muncul di mode edit */}
          {editId && (
            <button type="button" onClick={cancelEdit} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded font-medium">
              Batal
            </button>
          )}
        </form>

        <h2 className="text-xl font-semibold mb-4">Daftar Barang</h2>
        {!barang.length ? (
          <p className="text-gray-500">Belum ada barang.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {barang.map(item => (
              <article key={item.id} className="rounded-xl border bg-white p-4 shadow-sm flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{item.nama}</h3>
                  <p className="text-sm text-gray-600 mb-2">Kategori: {item.kategori || "Umum"}</p>
                  <p className="mb-2">Stok: <span className="font-bold">{item.stok}</span></p>
                  <span className={`rounded px-2 py-1 text-xs font-semibold ${item.stok < 5 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                    {item.stok < 5 ? "Perlu restock" : "Aman"}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => handleEditClick(item)} 
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium border border-blue-500 hover:bg-blue-50 px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)} 
                    className="text-red-500 hover:text-red-700 text-sm font-medium border border-red-500 hover:bg-red-50 px-3 py-1 rounded"
                  >
                    Hapus
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}