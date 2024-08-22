//Zeigt für kurze Zeit den Endscreen an, mit Paramter ('L' für Lose, 'W' für Win)
function endScreen(WL) {
  let backgr = document.getElementById("endScreen");
  let textBackgr = document.getElementById("winLoseTextBox");
  let endText = document.getElementById("winLoseText");
  let smallEndText = document.getElementById("smallWinLoseText");

  backgr.setAttribute("style", "visibility: unset;");
  textBackgr.setAttribute("style", "visibility: unset;");

  if (WL == "W") {
    endText.innerText = "🏆 GEWONNEN 🏆";
    endText.setAttribute("style", "color: green;");
    smallEndText.innerText = "🏆 GEWONNEN 🏆";
    smallEndText.setAttribute("style", "color: green;");
  } else {
    endText.innerText = "💀 VERLOREN 💀";
    endText.setAttribute("style", "color: rgb(255, 30, 0);");
    smallEndText.innerText = "💀 VERLOREN 💀";
    smallEndText.setAttribute("style", "color: rgb(255, 30, 0);");
  }

  //Nach kurzer Zeit wird EndScreen wieder ausgeblendet, damit man mit Buttons etc interagieren kann
  setTimeout(hide, 1500);
  function hide() {
    backgr.setAttribute("style", "visibility: hidden;");
    textBackgr.setAttribute("style", "visibility: hidden;");
    endText.setAttribute("style", "visibility: hidden");
  }
}
