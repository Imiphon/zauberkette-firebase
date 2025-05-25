function toggleUI() {
  //take parent
  const infoFrame = document.querySelector(".info-frame.brass-long.no-btn");
  if (!infoFrame) return;
  // take kids
  const chainFrame = infoFrame.querySelector(".chain-frame");
  const infoText = infoFrame.querySelector(".info-text");
  const sandClock = infoFrame.querySelector(".sand-clock");
  
  const btnGroup = document.querySelector(".btn-group");

  if (isActiveUI) {
    if (chainFrame) chainFrame.style.display = "";
    if (infoText) infoText.style.display = "flex";
    if (sandClock) sandClock.style.display = "none";
    if (btnGroup) btnGroup.style.display = "";
  } else {
    if (chainFrame) chainFrame.style.display = "";
    if (infoText) infoText.style.display = "none";
    if (sandClock) sandClock.style.display = "";
    if (btnGroup) btnGroup.style.display = "none";
  }
}
