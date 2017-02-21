import * as net from "net";
import * as fs from "fs";

// misc
const netConnect = (port: number, host: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const client = net.connect(port, host, () => resolve());
    client.on("error", reject);
  });
};
const fsStat = (path: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    fs.stat(path, (err) => {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });
};
interface IEnvVars {
  [key: string]: string;
}

const main = async () => {
  // validating that env vars are available
  const envVarNames = [
    "APP_PORT",
    "APP_LOG_DIR",
    "DATABASE_HOST"
  ]
  const envVarPairs = envVarNames.map((v) => <[string, string]>[v, process.env[v]]);
  const missingEnvVarPairs = envVarPairs.filter(([, v]) => typeof v === "undefined" || v.length === 0);
  if (missingEnvVarPairs.length > 0) {
    throw new Error(missingEnvVarPairs.map(([key]) => `${key} was missing`).join("\n"));
  }

  const envVars = envVarPairs.reduce((envVars, value) => {
    envVars[value[0]] = value[1];
    return envVars;
  }, <IEnvVars>{});

  // validating that the database port is accessible
  const dbPort = 5432;
  try {
    await netConnect(dbPort, envVars["DATABASE_HOST"]);
  } catch (err) {
    switch (err["code"]) {
      case "ENOTFOUND":
        throw new Error(`Host ${envVars["DATABASE_HOST"]} could not be found`);
      case "EHOSTUNREACH":
        throw new Error(`Host ${envVars["DATABASE_HOST"]} could not be reached`);
      case "ECONNREFUSED":
        throw new Error(`Host ${envVars["DATABASE_HOST"]} was not accessible at ${dbPort}`);
      default:
        throw err;
    }
  }

  // validating that the log dir exists
  try {
    await fsStat(envVars["APP_LOG_DIR"]);
  } catch (err) {
    throw new Error(`${envVars["APP_LOG_DIR"]} log dir does not exist`);
  }
};

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });