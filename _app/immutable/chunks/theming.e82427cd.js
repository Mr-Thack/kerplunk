import{g as n}from"./settings.82a6606d.js";import{u as s}from"./stores.88811b96.js";function a(e){document.documentElement.classList.remove(e)}function t(e){document.documentElement.classList.add(e)}function r(e){return document.documentElement.classList.contains(e)}async function d(){var e=await n(["theme","accent"]);console.log(e),e&&!e.error?(s.write("accent",e.data.accent),a("dark"),a("red"),t(e.data.accent),e.data.theme?t("light"):t("dark")):t("red")}export{t as a,d as g,r as i,a as r};
