import { safeQuery } from '../lib/db';
import { formatDuration, timeAgo, displayName } from '../lib/format';
import AutoRefresh from './components/AutoRefresh';

// Bu sayfa her istek için yeniden render edilir (canlı veri, cache yok).
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DISCORD_GUILD_ID = process.env.NEXT_PUBLIC_DISCORD_GUILD_ID || '1522572400661626950';

async function getDashboardData() {
  const [serverRows, voiceRows, activeRows, modRows] = await Promise.all([
    safeQuery('SELECT ip, port, is_online, online_players, max_players, updated_at FROM server_status WHERE id = 1'),
    safeQuery(
      'SELECT user_id, username, total_ms FROM voice_activity WHERE total_ms > 0 ORDER BY total_ms DESC LIMIT 15'
    ),
    safeQuery(
      'SELECT user_id, username, current_channel_name FROM voice_activity WHERE current_channel_id IS NOT NULL ORDER BY username ASC NULLS LAST'
    ),
    safeQuery(
      'SELECT user_id, username, reason, created_at FROM moderation_logs ORDER BY created_at DESC LIMIT 15'
    ),
  ]);

  return {
    server: serverRows[0] || null,
    voiceLeaderboard: voiceRows,
    activeVoice: activeRows,
    timeouts: modRows,
  };
}

export default async function DashboardPage() {
  const { server, voiceLeaderboard, activeVoice, timeouts } = await getDashboardData();

  const isOnline = Boolean(server?.is_online);
  const lastUpdated = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="shell">
      <AutoRefresh intervalMs={30000} />

      <header className="header">
        <div>
          <p className="brand-eyebrow">Luvax Dijital</p>
          <h1 className="brand-title">
            Valentina <span>// Ops Panel</span>
          </h1>
        </div>

        <div className="header-meta">
          <span className={`status-pill`}>
            <span className={`pulse-dot ${isOnline ? 'online' : 'offline'}`} />
            {isOnline ? 'Sunucu Çevrimiçi' : 'Sunucu Çevrimdışı'}
          </span>
          <span>Son güncelleme: {lastUpdated}</span>
        </div>
      </header>

      <div className="grid">
        {/* MOD.01 — SUNUCU DURUMU */}
        <section className="module col-7" data-tag="Mod.01 — Sunucu Durumu">
          <h2>Minecraft Sunucusu</h2>
          <div className="server-ip">{server?.ip || 'IP bilgisi henüz yok'}{server?.port ? `:${server.port}` : ''}</div>

          <div className="server-stats">
            <div className="stat">
              <span className="stat-value">
                {server?.online_players ?? '—'}
                {server?.max_players ? ` / ${server.max_players}` : ''}
              </span>
              <span className="stat-label">Aktif Oyuncu</span>
            </div>
            <div className="stat">
              <span className="stat-value">{isOnline ? 'AKTİF' : 'BAKIMDA'}</span>
              <span className="stat-label">Durum</span>
            </div>
          </div>

          {!server && (
            <p className="module-note">
              Henüz veri yok. Valentina botu en az bir kez çalıştığında bu bölüm otomatik olarak dolacak.
            </p>
          )}
          {server?.updated_at && <p className="module-note">Bot tarafından güncellendi: {timeAgo(server.updated_at)}</p>}
        </section>

        {/* DISCORD WIDGET */}
        <section className="module col-5" data-tag="Mod.02 — Discord">
          <h2>Sunucu Topluluğu</h2>
          <div className="widget-frame">
            <iframe
              src={`https://discord.com/widget?id=${DISCORD_GUILD_ID}&theme=dark`}
              width="100%"
              height="330"
              allowTransparency="true"
              sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
              title="Discord sunucu widget'ı"
            />
          </div>
        </section>

        {/* MOD.03 — ŞU AN SESLİ OLANLAR */}
        <section className="module col-6" data-tag="Mod.03 — Canlı Ses Durumu">
          <h2>Şu An Sesli Olanlar</h2>
          {activeVoice.length === 0 ? (
            <p className="empty-state">Şu anda hiç kimse sesli kanalda değil.</p>
          ) : (
            <ul className="list">
              {activeVoice.map((row) => (
                <li key={row.user_id}>
                  <span className="entry-name">{displayName(row.username, row.user_id)}</span>
                  <span className="badge">{row.current_channel_name || 'Bilinmeyen Kanal'}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* MOD.04 — SES AKTİVİTE SIRALAMASI */}
        <section className="module col-6" data-tag="Mod.04 — Ses Aktivitesi">
          <h2>Ses Aktivitesi Sıralaması</h2>
          {voiceLeaderboard.length === 0 ? (
            <p className="empty-state">Henüz kayıtlı ses aktivitesi yok.</p>
          ) : (
            <ul className="list">
              {voiceLeaderboard.map((row, index) => (
                <li key={row.user_id}>
                  <span className="rank">{String(index + 1).padStart(2, '0')}</span>
                  <span className="entry-name">{displayName(row.username, row.user_id)}</span>
                  <span className="entry-value">{formatDuration(row.total_ms)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* MOD.05 — T.O KAYITLARI */}
        <section className="module col-12" data-tag="Mod.05 — T.O. Kayıtları">
          <h2>Timeout (T.O.) Kayıtları</h2>
          {timeouts.length === 0 ? (
            <p className="empty-state">Henüz kimseye timeout uygulanmamış.</p>
          ) : (
            <ul className="list">
              {timeouts.map((row) => (
                <li key={`${row.user_id}-${row.created_at}`}>
                  <span className="entry-name">{displayName(row.username, row.user_id)}</span>
                  <span className="reason-tag">{row.reason || 'Sebep belirtilmedi'}</span>
                  <span className="entry-value">{timeAgo(row.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <footer className="footer">
        <span>Valentina © Luvax Dijital</span>
        <span>Bu panel Discord botuna canlı bağlanmaz — yalnızca paylaşılan veritabanından okur.</span>
      </footer>
    </div>
  );
}
