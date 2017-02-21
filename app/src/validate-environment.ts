import * as net from "net";
import * as fs from "fs";

// misc
const netConnect = (port: number, host: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const client = net.connect(port, host, () => resolve());
    client.on("err", reject);
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

const main = async () => {
  // validating that env vars are available
  const envVarNames = [
    "APP_PORT",
    "APP_LOG_DIR",
    "DATABASE_HOST"
  ]
  const envVarPairs = envVarNames.map((v) => [v, String(process.env[v])]);
  const missingEnvVarPairs = envVarPairs.filter(([, v]) => {
    return typeof v === "undefined" || v.length === 0;
  });
  if (missingEnvVarPairs.length > 0) {
    for (const [key] of missingEnvVarPairs) {
      console.log(`${key} was missing`);
    }

    process.exit(1);
  }
  interface IEnvVars {
    [key: string]: string;
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
    if (err["code"] === "ENOTFOUND") {
      console.log(`Host ${envVars["DATABASE_HOST"]} could not be found`);
      process.exit(1);
    } else if (err["code"] === "ECONNREFUSED") {
      console.log(`${envVars["DATABASE_HOST"]} was not accessible at ${dbPort}`);
      process.exit(1);
    }

    console.error(err);
    process.exit(1);
  }

  // validating that the log dir exists
  try {
    await fsStat(envVars["APP_LOG_DIR"]);
  } catch (err) {
    console.error(err);
    console.log(`${envVars["APP_LOG_DIR"]} log dir does not exist`);
    process.exit(1);
  }

  process.exit(0);
};
main();