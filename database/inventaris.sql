CREATE TABLE IF NOT EXISTS kategori (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nama VARCHAR(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_kategori_nama (nama)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS barang (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nama VARCHAR(150) NOT NULL,
  stok INT NOT NULL DEFAULT 0,
  kategori_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  KEY idx_barang_kategori_id (kategori_id),
  CONSTRAINT fk_barang_kategori
    FOREIGN KEY (kategori_id) REFERENCES kategori (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT chk_barang_stok_nonnegatif CHECK (stok >= 0)
) ENGINE=InnoDB;

INSERT IGNORE INTO kategori (nama) VALUES
  ('Elektronik'),
  ('Alat Tulis'),
  ('Perlengkapan Kantor');
