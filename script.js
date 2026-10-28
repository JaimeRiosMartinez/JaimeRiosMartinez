"use strict";

const textInput = document.getElementById("texto");
const fileInput = document.getElementById("archivo");
const loadBookButton = document.getElementById("cargar-libro");
const statusMessage = document.getElementById("estado");

const outputs = {
  words: document.getElementById("palabras"),
  vowels: document.getElementById("vocales"),
  consonants: document.getElementById("consonantes"),
  lazaro: document.getElementById("lazaro"),
  blindMan: document.getElementById("ciego"),
  cleric: document.getElementById("clerigo"),
  archpriest: document.getElementById("arcipreste"),
  wife: document.getElementById("mujer-lazaro")
};

const letters = "a-zñáéíóúü";
const wordPattern = new RegExp(`[${letters}]+`, "g");
const vowelPattern = /[aeiouáéíóúü]/g;
const consonantPattern = /[bcdfghjklmnñpqrstvwxyz]/g;
const characterPatterns = {
  lazaro: /(^|[^a-zñáéíóúü])lázaro(?=$|[^a-zñáéíóúü])/g,
  blindMan: /(^|[^a-zñáéíóúü])ciego(?=$|[^a-zñáéíóúü])/g,
  cleric: /(^|[^a-zñáéíóúü])clérigo(?=$|[^a-zñáéíóúü])/g,
  archpriest: /(^|[^a-zñáéíóúü])arcipreste(?=$|[^a-zñáéíóúü])/g,
  wife: /(^|[^a-zñáéíóúü])(?:mujer\s+de\s+lázaro|mi\mi+muger\s+mujer|tu\s+mujer)(?=$|[^a-zñáéíóúü])/g
};

function countMatches(text, pattern) {
  return Array.from(text.matchAll(pattern)).length;
}

function updateCounts() {
  const text = textInput.value.toLocaleLowerCase("es");
  const matches = text.match(wordPattern) ?? [];

  outputs.words.value = matches.length.toLocaleString("es-ES");
  outputs.vowels.value = countMatches(text, vowelPattern).toLocaleString("es-ES");
  outputs.consonants.value = countMatches(text, consonantPattern).toLocaleString("es-ES");

  for (const [key, pattern] of Object.entries(characterPatterns)) {
    outputs[key].value = countMatches(text, pattern).toLocaleString("es-ES");
  }
}

textInput.addEventListener("input", updateCounts);

fileInput.addEventListener("change", async () => {
  const file = fileInput.files?.[0];
  if (!file) return;

  try {
    textInput.value = await file.text();
    updateCounts();
    statusMessage.textContent = `Texto cargado: ${file.name}.`;
  } catch (error) {
    statusMessage.textContent = `No se pudo leer el archivo: ${error.message}`;
  }
});

loadBookButton.addEventListener("click", async () => {
  loadBookButton.disabled = true;
  statusMessage.textContent = "Cargando el texto del libro…";

  try {
    const response = await fetch("lazarillo_limpio.txt");
    if (!response.ok) {
      throw new Error(`el servidor respondió con ${response.status}`);
    }

    textInput.value = await response.text();
    updateCounts();
    statusMessage.textContent = "Texto del libro cargado correctamente.";
  } catch (error) {
    statusMessage.textContent = `No se pudo cargar lazarillo_limpio.txt. Comprueba que esté junto a la página y ábrela desde GitHub Pages o un servidor local. Detalle: ${error.message}`;
  } finally {
    loadBookButton.disabled = false;
  }
});
