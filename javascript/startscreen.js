const maxZeilenSpalten = 20;

let body = document.querySelector("body");
let startScreen = document.getElementById("startScreen");
let gameplay = document.getElementById("gameplay");

gameplay.remove();

let zeilen;
let spalten;
let bomben;
let bombenLeft;
let noBombsFelder;

function checkInput() {
  //wird onclick von Spiel Start Button aufgerufen
  zeilen = document.getElementById("textZeilen").value;
  spalten = document.getElementById("textSpalten").value;
  bomben = document.getElementById("textBomben").value;
  bombenLeft = bomben
  noBombsFelder = zeilen * spalten - bomben;

  let maxBombs = Math.floor(zeilen * spalten * 0.6);
  let errorDiv = document.getElementById("errorDiv");

  let errorMessage = [];

  //Fehlerhafte Eingaben in errorMessage Array speichern und ausgeben
  //wenn Array leer -> Eingabe korrekt
  if (zeilen < 5 || zeilen > maxZeilenSpalten || zeilen === "") {
    errorMessage.push("Zeilenangabe ungültig");
  }
  if (spalten < 5 || spalten > maxZeilenSpalten || spalten === "") {
    errorMessage.push("Spaltenangabe ungültig");
  }
  if (bomben < 1 || bomben > maxBombs || bomben === "") {
    errorMessage.push("Bombenzahl ungültig");
  }

  if (errorMessage.length > 0) {
    errorDiv.innerText = errorMessage.join(", ");
  } else {
    errorDiv.innerText = "";
    startScreen.remove();
    body.append(gameplay);
    generateGame();
  }
}
