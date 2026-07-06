import { Pool } from 'pg';

// Bu panel Valentina botuna hiçbir şekilde canlı bağlanmaz; yalnızca
// botun da yazdığı aynı PostgreSQL veritabanından OKUMA yapar.
let pool;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}

/**
 * Bir SQL sorgusunu güvenli şekilde çalıştırır. Veritabanı henüz hazır
 * değilse (örn. bot hiç çalıştırılmadıysa tablolar yoktur) veya bağlantı
 * hatası oluşursa, sayfayı çökertmek yerine boş bir dizi döner.
 */
export async function safeQuery(sql, params = []) {
  try {
    const { rows } = await getPool().query(sql, params);
    return rows;
  } catch (err) {
    console.error('[valentina-web] Veritabanı sorgu hatası:', err.message);
    return [];
  }
}
