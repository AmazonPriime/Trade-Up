function show(toShow, toHide) {
  const elShow = document.getElementById(toShow);
  const elHide = document.getElementById(toHide);

  if (elShow) {
    elShow.classList.remove("hide");
    elShow.classList.add("show");
  }
  if (elHide){
    elShow.classList.remove("show");
    elHide.classList.add("hide");
  }
}
