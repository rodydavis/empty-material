import * as utils from "https://cdn.skypack.dev/@guidezpl/material-color-utilities";

function themeFromSeed(seed) {
  const palette = utils.CorePalette.of(seed);
  return {
    seed: seed,
    schemes: {
      light: utils.Scheme.light(seed),
      dark: utils.Scheme.dark(seed),
    },
    palettes: {
      primary: palette.a1,
      secondary: palette.a2,
      tertiary: palette.a3,
      neutral: palette.n1,
      neutralVariant: palette.n2,
      error: palette.error,
    },
    customColors: [],
  };
}

const target = document.body;
const input = document.querySelector("#seed");
const random = document.querySelector("#random");
const reset = document.querySelector("#reset");
const brightness = document.querySelector("#brightness");

function applyTheme(theme, options) {
  const target = options?.target || document.body;
  const isDark =
    options?.dark ?? window.matchMedia("(prefers-color-scheme: dark)").matches;
  const scheme = isDark ? theme.schemes.dark : theme.schemes.light;
  const json = Object(scheme)["props"];
  for (const [key, value] of Object.entries(json)) {
    const token = key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    const color = utils.hexFromArgb(value);
    target.style.setProperty(`--md-sys-color-${token}`, color);
  }
}

function randomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function setTheme(color, dark) {
  if (color === null) {
    return;
  }
  if (color === "") {
    localStorage.removeItem("theme");
    localStorage.removeItem("brightness");
    brightness.value = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    target.classList.remove("dark-theme");
    target.classList.remove("light-theme");
    target.setAttribute("style", "");
    reset.setAttribute("disabled", "");
    return;
  }
  reset.removeAttribute("disabled");
  localStorage.setItem("theme", color);
  const intColor = utils.argbFromHex(color);
  const theme = themeFromSeed(intColor);
  applyTheme(theme, { target, dark });
}

input.addEventListener("input", (event) => {
  const color = event.target.value;
  setTheme(color, brightness.value === "dark");
});

random.addEventListener("click", () => {
  const color = randomColor();
  input.value = color;
  setTheme(color, brightness.value === "dark");
});

reset.addEventListener("click", () => {
  input.value = "";
  setTheme("", brightness.value === "dark");
});

brightness.addEventListener("change", (e) => {
  const value = e.target.value;
  const isDark = value === "dark";
  if (isDark) {
    target.classList.remove("light-theme");
    target.classList.add("dark-theme");
  } else {
    target.classList.remove("dark-theme");
    target.classList.add("light-theme");
  }
  const color = localStorage.getItem("theme");
  if (color) {
    setTheme(color, isDark);
  }
  localStorage.setItem("brightness", value);
});

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (event) => {
    const isDark = event.matches;
    const color = localStorage.getItem("theme");
    setTheme(color, isDark);
  });

const savedTheme = localStorage.getItem("theme");
const savedBrightness = localStorage.getItem("brightness");
brightness.value =
  savedBrightness || window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
if (savedTheme) {
  setTheme(savedTheme, savedBrightness === "dark");
}
