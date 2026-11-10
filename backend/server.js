import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";

const app = express();
app.use(express.json()); 
app.use(cors());

const db = await mysql.createPool({
  host: 'localhost',
  user: 'root',      
  password: '',      
  database: 'inventaris' 
});

// 1. Endpoint GET
app.get("/api/barang", async (req, res, next) => {
  try {
    const [rows] = await db.execute(`
      SELECT b.id, b.nama, b.stok, k.nama AS kategori
      FROM barang b 
      LEFT JOIN kategori k ON k.id = b.kategori_id
      ORDER BY b.id DESC
    `);
    res.json(rows);
  } catch (error) { next(error); }
});

// 2. Endpoint POST
app.post("/api/barang", async (req, res, next) => {
  try {
    const { nama, stok } = req.body;
    
    if (!nama || nama.trim() === "") {
      return res.status(400).json({ message: "Nama wajib diisi" });
    }
    if (stok < 0) {
      return res.status(400).json({ message: "Stok tidak boleh negatif" });
    }

    const [result] = await db.execute(
      "INSERT INTO barang (nama, stok, kategori_id) VALUES (?, ?, 1)", 
      [nama, stok || 0]
    );
    
    res.status(201).json({ message: "Barang berhasil disimpan", id: result.insertId });
  } catch (error) { next(error); }
});

// 3. Endpoint DELETE
app.delete("/api/barang/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await db.execute("DELETE FROM barang WHERE id = ?", [id]);
    res.json({ message: "Data berhasil dihapus" });
  } catch (error) { next(error); }
});

// 4. Endpoint PUT (HARUS DI SINI, SEBELUM ERROR MIDDLEWARE)
app.put("/api/barang/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { nama, stok } = req.body;

    // Tambahkan validasi agar aman
    if (!nama || nama.trim() === "") {
      return res.status(400).json({ message: "Nama wajib diisi" });
    }

    await db.execute(
      "UPDATE barang SET nama = ?, stok = ? WHERE id = ?", 
      [nama, stok || 0, id]
    );
    res.json({ message: "Data berhasil diperbarui" });
  } catch (error) { next(error); }
});

// 5. Error Middleware Terpusat (WAJIB PALING BAWAH)
app.use((err, req, res, next) => {
  console.error("Terjadi Kesalahan di Server:", err.message);
  res.status(500).json({ message: err.message || "Terjadi kesalahan pada server" });
});

app.listen(3000, () => console.log("Server berjalan di port 3000"));