import { UIController } from "./uiController.js";
import { MapController } from "./mapController.js";
import { DataController } from "./dataController.js";

document.addEventListener("DOMContentLoaded", () => {
  DataController.init();
  UIController.init();
  MapController.init();
});
