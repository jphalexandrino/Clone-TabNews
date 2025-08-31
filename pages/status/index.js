import useSWR from "swr";
import { FaUnlock, FaLink, FaRegClock } from "react-icons/fa";
import { SiPostgresql } from "react-icons/si";

async function fetchAPI(key) {
  const response = await fetch(key);
  return await response.json();
}

export default function StatusPage() {
  return (
    <div className="status-container">
      <div className="status-card">
        {/* Título */}
        <h1 className="status-title">📊 Status Page</h1>

        {/* Última atualização */}
        <div className="status-updated">
          <UpdatedAt />
        </div>

        {/* Categoria: Banco de Dados */}
        <div className="status-section">
          <h2 className="status-section-title">Banco de Dados</h2>
          <div className="status-grid">
            <div className="status-box full" data-status="info">
              <SiPostgresql className="status-icon" />
              <DbVersion />
            </div>
            <div className="status-box full" data-status="info">
              <FaRegClock className="status-icon" />
              <DbUptime />
            </div>
            <div className="status-box" data-status="ok">
              <FaUnlock className="status-icon" />
              <OpenedConnections />
            </div>
            <div className="status-box" data-status="ok">
              <FaLink className="status-icon" />
              <MaxConnections />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Última vez atualizado:
function UpdatedAt() {
  const response = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let UpdatedAtText = "Carregando...";

  if (response.data) {
    UpdatedAtText = new Date(response.data.updated_at).toLocaleString("pt-BR");
    if (response.error) {
      UpdatedAtText = "Erro ao carregar";
    }
  }

  return <div>Última atualização: {UpdatedAtText}</div>;
}

// Máximo de conexões:
function MaxConnections() {
  const response = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let MaxConnectionsText = "Carregando...";

  if (response.data) {
    MaxConnectionsText = response.data.dependencies.database.max_connections;
    if (response.error) {
      MaxConnectionsText = "Erro ao carregar";
    }
  }

  return <div>Máximo de conexões: {MaxConnectionsText}</div>;
}

// Conexões Abertas (Talvez deixar apenas para devs):
function OpenedConnections() {
  const response = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let OpenedConnectionsText = "Carregando...";

  if (response.data) {
    OpenedConnectionsText =
      response.data.dependencies.database.opened_connections;
    if (response.error) {
      OpenedConnectionsText = "Erro ao carregar";
    }
  }

  return <div>Conexões abertas: {OpenedConnectionsText}</div>;
}

function DbVersion() {
  const response = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let version = null;
  let error = false;
  if (response.data) {
    version = response.data.dependencies.database.version;
    if (response.error) {
      error = true;
    }
  }

  if (error) {
    return (
      <div className="db-version-content">
        <span className="db-version-label">PostgreSQL</span>
        <span className="db-version-error">Erro ao carregar</span>
      </div>
    );
  }

  if (!version) {
    return (
      <div className="db-version-content">
        <span className="db-version-label">PostgreSQL</span>
        <span className="db-version-loading">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="db-version-content">
      <span className="db-version-label">PostgreSQL</span>
      <span className="db-version-value">{version}</span>
    </div>
  );
}

// Tempo de atividade do banco de dados (Uptime) - opcional
function DbUptime() {
  const response = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });
  let uptime = "Carregando...";
  if (response.data) {
    uptime = response.data.dependencies.database.uptime; // ajuste conforme o campo real
    if (response.error) uptime = "Erro ao carregar";
  }
  return <div>Uptime: {uptime}</div>;
}

export { fetchAPI };
