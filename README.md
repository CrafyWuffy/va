# Valentina — Ops Panel (valentina-web)

Bu, **Valentina Discord botuyla hiçbir canlı bağlantısı olmayan** ayrı bir
web sitesidir. Discord bot'a hiç bağlanmaz; yalnızca botun da yazdığı
**aynı PostgreSQL (Neon) veritabanından okuma** yaparak şunları gösterir:

- Minecraft sunucusunun IP'si ve anlık oyuncu durumu
- Şu an sesli kanalda olan kullanıcılar ve hangi kanalda oldukları
- Ses aktivitesi sıralaması (en çok sesli kalanlar)
- Timeout (T.O.) kayıtları (anti-spam sistemi tarafından verilen cezalar)
- Discord sunucusunun canlı üye widget'ı (Discord'un kendi widget iframe'i)

Vercel'e deploy edildiğinde botla aynı sunucuda/süreçte çalışmaz;
tamamen bağımsız, sunucusuz (serverless) bir web sitesidir.

---

## 📋 Gereksinimler

| Yazılım | Minimum Sürüm |
|---|---|
| Node.js | 18.0.0 veya üzeri |
| npm | 9.0.0 veya üzeri |
| next | ^14.2.5 |
| pg (PostgreSQL) | ^8.11.5 |

---

## ⚙️ Yerel Kurulum

```bash
cd valentina-web
npm install
cp .env.example .env.local
```

`.env.local` dosyasını açıp doldurun:

```env
DATABASE_URL=postgresql://kullanici:sifre@host/veritabani?sslmode=require&channel_binding=require
NEXT_PUBLIC_DISCORD_GUILD_ID=1522572400661626950
```

> 🔒 **Önemli:** `DATABASE_URL`, Valentina botunun kullandığı **aynı**
> Neon veritabanı bağlantı adresidir. Bu panel yalnızca **okuma**
> sorguları çalıştırır, hiçbir tabloya yazma yapmaz — ama yine de bu
> bilgiyi kimseyle paylaşmayın.

Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

Tarayıcıda `http://localhost:3000` adresini açın.

---

## 🚀 Vercel'e Deploy Etme

1. Bu klasörü (`valentina-web/`) ayrı bir GitHub reposuna yükleyin (veya
   mevcut reponuzda alt klasör olarak tutup Vercel'de "Root Directory"
   olarak `valentina-web` seçin).
2. [vercel.com](https://vercel.com) üzerinden **Add New Project** ile bu
   repoyu içe aktarın. Next.js otomatik olarak algılanır.
3. **Environment Variables** kısmına şunları ekleyin:
   - `DATABASE_URL` → Neon bağlantı adresiniz
   - `NEXT_PUBLIC_DISCORD_GUILD_ID` → `1522572400661626950`
4. **Deploy** butonuna basın.

Bu kadar — Vercel projesinin Discord botuyla, tokenlarla veya Discord
API'siyle **hiçbir bağlantısı yoktur**. Sadece veritabanına bağlanır.

---

## 🧩 Verinin Kaynağı

Bu site hiçbir veriyi kendisi hesaplamaz; sadece Valentina botunun
yazdığı şu tabloları okur:

| Tablo | Ne için kullanılır |
|---|---|
| `server_status` | Sunucu IP'si, çevrimiçi/çevrimdışı durumu, anlık oyuncu sayısı |
| `voice_activity` | Toplam ses süresi + kullanıcının **şu an** hangi ses kanalında olduğu |
| `moderation_logs` | Anti-spam sisteminin verdiği timeout (T.O.) kayıtları |

Bot çalışmıyorsa veya hiç çalıştırılmadıysa, bu tablolar boş/eksik
olabilir; panel bu durumda hata vermek yerine "Henüz veri yok" gibi
bilgilendirici boş durumlar gösterir.

Sayfa, canlı bir "ops panel" hissi vermesi için **30 saniyede bir**
arka planda kendini otomatik yeniler.

---

## 🛠️ Sorun Giderme

- **Bütün modüller "Henüz veri yok" gösteriyor:** Valentina botunun en
  az bir kez çalışmış ve veritabanı tablolarını oluşturmuş olması
  gerekir. Botu bir kez çalıştırıp birkaç dakika bekleyin.
- **Discord widget'ı görünmüyor:** Sunucu ayarlarınızda **Server
  Settings > Widget > Enable Server Widget** seçeneğinin açık olduğundan
  emin olun; kapalıysa Discord widget'ı hiçbir sitede çalışmaz.
- **Veritabanı bağlantı hatası:** `DATABASE_URL` değerinin doğru
  olduğundan ve Neon veritabanınızın aktif olduğundan emin olun.

---

**Luvax Dijital © Valentina Ops Panel**
