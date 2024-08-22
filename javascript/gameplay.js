let gameplayArray = [];
let debugMode = false;
let defuseMode = false;
let spielVorbei = false;
let timeCount = 1;

let minenLeftAnzeige;
let timerLoop;

function generateGame() {
  minenLeftAnzeige = document.getElementById("minesLeft");
  minenLeftAnzeige.innerText = "Minen übrig: " + bombenLeft;
  let table = document.getElementById("gameplayTable");

  //Tabelle der Größe Zeilen mal Spalten erstellen und zusätzlich Matrix derselben Größe anlegen
  //Matrix speichern an jedem Eintrag Info zu einer Tabellenzelle (Bombe, aufgedeckt, entschärft(marked), Bombennachbarn)
  //jede Zelle bekommt eigene ID, die mit den Indizes der Matrix übereinstimmen
  for (let i = 0; i < zeilen; i++) {
    let row = document.createElement("tr");
    table.append(row);
    gameplayArray.push([]);

    for (let j = 0; j < spalten; j++) {
      let cell = document.createElement("td");
      row.append(cell);
      cell.setAttribute("id", i + "-" + j);
      cell.setAttribute("onclick", "update(" + i + "," + j + ")");

      gameplayArray[i].push({
        aufgedeckt: false,
        bombe: false,
        marked: false,
        bombenNachbar: 0,
      });
    }
  }

  //Array speichert Positionen der Bomben
  //falls Zahl bereits in Array ist (find) -> erneut random zahl generieren -> keine doppelten Bomben an einem Feld
  let randomNums = [];
  let felderZahl = zeilen * spalten;

  for (let i = 0; i < bomben; i++) {
    let num = Math.floor(Math.random() * felderZahl);
    while (randomNums.find((elem) => elem == num) != undefined) {
      //returned undefined, wenn nicht in Array gefunden
      num = Math.floor(Math.random() * felderZahl);
    }
    randomNums.push(num);
  }

  //Bomben auf Positionen verteilen
  let count = 0;
  for (let i = 0; i < zeilen; i++) {
    for (let j = 0; j < spalten; j++, count++) {
      if (randomNums.find((elem) => elem == count) != undefined) {
        //wenn Position in array -> bombe = true
        gameplayArray[i][j].bombe = true;
      }
    }
  }

  //Bombennachbarn in Matrix eintragen
  for (let i = 0; i < zeilen; i++) {
    for (let j = 0; j < spalten; j++) {
      if (gameplayArray[i][j].bombe == false) {
        gameplayArray[i][j].bombenNachbar = berechneNachbarn(i, j);
      }
    }
  }

  //Timer Starten
  timerLoop = setInterval(timer, 1000);
}

//geht einmal um die 8 anliegenden Felder herum
function berechneNachbarn(idxRow, idxCol) {
  let count = 0;

  for (let i = idxRow - 1; i <= idxRow + 1; i++) {
    for (let j = idxCol - 1; j <= idxCol + 1; j++) {
      if (!(i < 0 || j < 0 || i >= zeilen || j >= spalten)) {
        //Index gültig?
        if (gameplayArray[i][j].bombe == true) {
          count++;
        }
      }
    }
  }

  return count;
}

//Timer
function timer() {
  let time = document.getElementById("timer");
  time.innerText = timeCount;
  timeCount++;
}

//Jede Zelle hat onclick funktion update():
function update(idxRow, idxCol) {
  let current = document.getElementById(idxRow + "-" + idxCol);

  if (defuseMode) {
    //falls defuseMode aktiv: setzen oder entfernen der Flaggen
    //aktualisieren der Matrix (marked)
    let str = current.innerText;
    if (str == "") {
      if (bombenLeft == 0) {
        //Bomen Left Anzeige blinkt rot wenn bereit alle Entschärfungen aufgebraucht sind
        minenLeftAnzeige.setAttribute(
          "style",
          "transition: color 200ms; color: red;"
        );
        setTimeout(colorChange, 200);
        function colorChange() {
          minenLeftAnzeige.setAttribute(
            "style",
            "transition: color 200ms; color: white;"
          );
        }
      } else {
        current.innerText = "🚩";
        gameplayArray[idxRow][idxCol].marked = true;
        bombenLeft--;
        minenLeftAnzeige.innerText = "Minen übrig: " + bombenLeft;
        checkGameWon();
      }
    } else {
      current.innerText = "";
      gameplayArray[idxRow][idxCol].marked = false;
      bombenLeft++;
      minenLeftAnzeige.innerText = "Minen übrig: " + bombenLeft;
    }

    //hier returnen, der Rest der Funktion ist für den Fall, wenn defuseMode nicht aktiv ist
    return;
  } else {
    //hier nicht mehr im defuseMode, aber markierte/entschärfte Felder sind nicht klickbar -> return
    //Flagge im defuseModus entfernen -> Feld wieder klickbar
    if (gameplayArray[idxRow][idxCol].marked) {
      return;
    }

    gameplayArray[idxRow][idxCol].aufgedeckt = true;
    current.removeAttribute("onclick"); //aufgedeckte Zellen können nicht erneut geklickt werden
  }

  if (gameplayArray[idxRow][idxCol].bombe == true) {
    //Spiel verloren
    spielVorbei = true;

    //alle onlicks entfernen -> keine weiteren Interaktionen mit Spielfeld möglich
    for (let i = 0; i < zeilen; i++) {
      for (let j = 0; j < spalten; j++) {
        let td = document.getElementById(i + "-" + j);
        td.removeAttribute("onclick");

        if (gameplayArray[i][j].bombe == true) {
          gameplayArray[i][j].aufgedeckt = true;
          td.setAttribute("style", "background-color: rgb(107, 1, 1);");
          td.innerText = "💣";
        }
      }
    }
    current.setAttribute("style", "background-color: rgb(255, 30, 0);");
    clearInterval(timerLoop); //Timer stoppen

    endScreen("L");
  } else {
    //Keine Mine getroffen
    if (current.innerText == "🚩") {
      //falls eine als Mine gekennzeichnete Zelle geklickt wird -> Minenleftcounter erhöhen
      bombenLeft++;
      minenLeftAnzeige.innerText = "Minen übrig: " + bombenLeft;
      current.innerText = "";
    }
    noBombsFelder--;
    checkGameWon();
    current.setAttribute("style", "background-color: rgb(36, 36, 73);");
    let nachbarn = gameplayArray[idxRow][idxCol].bombenNachbar;
    if (nachbarn == 0) {
      //alle umliegenden Felder auch aufdecken -> falls wieder 0, rekursiver Aufruf von update() und deckeUmliegendeAuf()
      deckeUmliegendeAuf(idxRow, idxCol);
    } else {
      current.innerText = nachbarn;
    }
  }
}

function checkGameWon() {
  if (noBombsFelder == 0 && bombenLeft == 0) {
    //Timer stoppen und Winscreen
    spielVorbei = true;
    clearInterval(timerLoop);
    disableOnclickWon();
    endScreen("W");
  }
}

function disableOnclickWon() {
  //alle onclicks entfernen (bei Lose wird das in update() gemacht, da dort zb noch zusätzlich alle Bombenpositionen aufgedeckt werden)
  for (let i = 0; i < zeilen; i++) {
    for (let j = 0; j < spalten; j++) {
      let td = document.getElementById(i + "-" + j);
      td.removeAttribute("onclick");
    }
  }
}

function deckeUmliegendeAuf(row, col) {
  //alle 8 anliegenden Felder aufgedeckt, wenn wieder 0 Rekursion mit update()
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (!(i < 0 || j < 0 || i >= zeilen || j >= spalten)) {
        //Index gültig?
        if (gameplayArray[i][j].aufgedeckt == false) {
          update(i, j);
        }
      }
    }
  }
}

function debugModus() {
  if(spielVorbei) {
    return;
  }
  debugMode = !debugMode;
  if (debugMode) {
    //Alle Bomben aufdecken, eigende update() funktion dafür, da richtiges Spielfeld gespeichert bleibt
    //onclicks entfernen -> Modus zeigt nur Bomben an, um weiter zu Spielen Modus wieder wechseln
    for (let i = 0; i < zeilen; i++) {
      for (let j = 0; j < spalten; j++) {
        let td = document.getElementById(i + "-" + j);
        td.removeAttribute("onclick");
        if (gameplayArray[i][j].bombe == true) {
          updateDebug(i, j);
        }
      }
    }
  } else {
    //wenn Modus inaktiv -> Spielstand wieder herstellen -> onclicks hinzufügen
    for (let i = 0; i < zeilen; i++) {
      for (let j = 0; j < spalten; j++) {
        if (gameplayArray[i][j].aufgedeckt == false) {
          let td = document.getElementById(i + "-" + j);
          td.setAttribute("onclick", "update(" + i + "," + j + ")");
          if (gameplayArray[i][j].marked == true) {
            td.innerText = "🚩";
          } else {
            td.innerText = "";
          }
          td.setAttribute("style", "background-color: rgb(51, 51, 102);");
        }
      }
    }
  }
}

//wird von debugModus() aufgerufen, zeigt Bomben an richtigen Positionen an
function updateDebug(idxRow, idxCol) {
  let ths = document.getElementById(idxRow + "-" + idxCol);

  if (!spielVorbei) {
    ths.setAttribute("style", "background-color: rgb(107, 1, 1);");
    ths.innerText = "💣";
  }
}

function defuseModus() {
  if (!spielVorbei) {
    defuseMode = !defuseMode;

    let btn = document.getElementById("defusebtn");
    if (defuseMode) {
      btn.innerText = "Entschärfen 🚩";
    } else {
      btn.innerText = "Aufdecken 🔍";
    }
  }
}

//reset Button während und nach den Spiel
//da alles auf index.html Seite ist, muss letzter Spielstand(Arrays, Tabelle) nicht manuell zurückgestzt werden -> refresh erledigt das
function newGame() {
  location.reload();
}
