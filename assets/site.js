"use strict";
document.documentElement.classList.add("js");

const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector(".nav-links");
if (menuButton && menu) {
  const closeMenu = () => {
    menu.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.textContent = "Menú";
  };
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menu.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.textContent = open ? "Cerrar" : "Menú";
  });
  menu.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });
}

const notes = Array.from(document.querySelectorAll(".note"));
const filters = Array.from(document.querySelectorAll(".filter-button"));
const search = document.querySelector("#note-search");
const count = document.querySelector("#note-count");
const empty = document.querySelector("#empty-notes");
let selectedArea = "all";
const normalize = value => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function filterNotes() {
  const query = normalize(search ? search.value.trim() : "");
  let visible = 0;
  notes.forEach(note => {
    const areaMatches = selectedArea === "all" || note.dataset.area === selectedArea;
    const textMatches = normalize(note.textContent).includes(query);
    note.hidden = !(areaMatches && textMatches);
    if (!note.hidden) visible += 1;
  });
  if (count) count.textContent = `${visible} ${visible === 1 ? "apunte disponible" : "apuntes disponibles"}`;
  if (empty) empty.hidden = visible !== 0;
}
filters.forEach(button => {
  button.addEventListener("click", () => {
    selectedArea = button.dataset.filter;
    filters.forEach(filter => filter.setAttribute("aria-pressed", String(filter === button)));
    filterNotes();
  });
});
if (search) search.addEventListener("input", filterNotes);
document.querySelectorAll("[data-print]").forEach(button => button.addEventListener("click", () => window.print()));
