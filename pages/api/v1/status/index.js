import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseVersion = await database
    .query("SHOW server_version;")
    .then((value) => {
      return value.rows[0].server_version;
    });

  const maxConnections = await database
    .query("SHOW max_connections;")
    .then((value) => {
      return value.rows[0].max_connections;
    });

  const databaseName = process.env.POSTGRES_DB;
  const openedConnections = await database
    .query({
      text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
      values: [databaseName],
    })
    .then((value) => {
      return value.rows[0].count;
    });

  const uptimeRaw = await database
    .query("SELECT now() - pg_postmaster_start_time() AS uptime;")
    .then((value) => value.rows[0].uptime);

  // Função para formatar o intervalo do PostgreSQL para string amigável
  function formatPgInterval(interval) {
    if (!interval) return "-";
    // Se for objeto (pg retorna { days, hours, minutes, seconds, ... })
    if (typeof interval === "object") {
      const days = interval.days || 0;
      const hours = interval.hours || 0;
      const minutes = interval.minutes || 0;
      let result = [];
      if (days > 0) result.push(`${days} dia${days > 1 ? "s" : ""}`);
      if (hours > 0) result.push(`${hours}h`);
      if (minutes > 0) result.push(`${minutes}min`);
      if (result.length === 0) result.push("<1min");
      return result.join(", ");
    }
    // Se for string, retorna como está
    return String(interval);
  }
  const uptime = formatPgInterval(uptimeRaw);

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersion,
        max_connections: parseInt(maxConnections),
        opened_connections: openedConnections,
        uptime,
      },
    },
  });
}

export default status;
