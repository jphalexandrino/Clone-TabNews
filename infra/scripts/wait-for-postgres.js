const { exec } = require("node:child_process");

function chekPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);
  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      chekPostgres();
      return;
    }
    console.log("\n✅ Postgres está pronto e aceitando conexões!\n\n");
  }
}

process.stdout.write("\n🔄 Aguardando Postgres Aceitar conexões");
chekPostgres();
