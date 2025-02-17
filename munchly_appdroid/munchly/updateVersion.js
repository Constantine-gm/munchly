import fs from "fs"; // Modulo per interagire con il filesystem
import xml2js from "xml2js"; // Modulo per manipolare XML

const parser = new xml2js.Parser(); // Parser per leggere XML
const builder = new xml2js.Builder(); // Builder per scrivere XML

// Funzione per incrementare la versione
function incrementVersion(version) {
  const versionParts = version.split(".").map(Number); // Splitta la versione in array di numeri
  versionParts[2] += 1; // Incrementa la parte "patch" della versione
  return versionParts.join("."); // Ritorna la versione incrementata
}

// Leggi il file config.xml
fs.readFile("config.xml", (err, data) => {
  if (err) throw err; // Se c'è un errore, termina l'esecuzione

  parser.parseString(data, (err, result) => {
    if (err) throw err; // Se c'è un errore nel parsing, termina l'esecuzione

    // Ottieni la versione attuale dal file config.xml
    const currentVersion = result.widget.$.version;
    console.log(`Versione corrente: ${currentVersion}`);

    // Incrementa la versione
    const newVersion = incrementVersion(currentVersion);
    console.log(`Nuova versione: ${newVersion}`);

    // Aggiorna la versione nel file config.xml
    result.widget.$.version = newVersion;

    // Scrivi di nuovo il file config.xml con la nuova versione
    const xml = builder.buildObject(result);
    fs.writeFile("config.xml", xml, (err) => {
      if (err) throw err; // Se c'è un errore nella scrittura, termina l'esecuzione
      console.log(`Versione aggiornata a ${newVersion}`);
    });
  });
});
