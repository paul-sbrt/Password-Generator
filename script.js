// Étape 1: Définir les caractères possibles
const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

// Étape 2: Sélectionner les éléments du DOM
const passwordField = document.getElementById("password");
const copyBtn = document.getElementById("copy-btn");
const lengthSlider = document.getElementById("length");
const lengthValue = document.getElementById("length-value");
const uppercaseCheckbox = document.getElementById("uppercase");
const lowercaseCheckbox = document.getElementById("lowercase");
const numbersCheckbox = document.getElementById("numbers");
const symbolsCheckbox = document.getElementById("symbols");
const generateBtn = document.getElementById("generate-btn");
const messageField = document.getElementById("message");
const strengthText = document.getElementById("strength-text");
const strengthIndicator = document.getElementById("strength-indicator");

// Mettre à jour la valeur de longueur affichée
lengthValue.textContent = lengthSlider.value;

// Ajouter un événement pour mettre à jour la valeur lors du déplacement du slider
lengthSlider.addEventListener("input", () => {
  lengthValue.textContent = lengthSlider.value;
  updateStrengthMeter();
});

// Ajouter des événements pour mettre à jour l'indicateur lorsque les options changent
uppercaseCheckbox.addEventListener("change", updateStrengthMeter);
lowercaseCheckbox.addEventListener("change", updateStrengthMeter);
numbersCheckbox.addEventListener("change", updateStrengthMeter);
symbolsCheckbox.addEventListener("change", updateStrengthMeter);

// Étape 3: Fonction pour générer le mot de passe
function generatePassword() {
  let characters = "";
  let passwordLength = parseInt(lengthSlider.value);
  let password = "";

  // Réinitialiser le message
  messageField.textContent = "";
  messageField.style.color = "red";

  // Ajouter les types de caractères sélectionnés
  if (uppercaseCheckbox.checked) {
    characters += uppercaseLetters;
  }
  if (lowercaseCheckbox.checked) {
    characters += lowercaseLetters;
  }
  if (numbersCheckbox.checked) {
    characters += numbers;
  }
  if (symbolsCheckbox.checked) {
    characters += symbols;
  }

  // Vérifier si au moins un type de caractère est sélectionné
  if (characters.length === 0) {
    messageField.textContent =
      "Veuillez sélectionner au moins un type de caractère.";
    return;
  }

  // Générer le mot de passe
  for (let i = 0; i < passwordLength; i++) {
    let randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }

  // Afficher le mot de passe
  passwordField.value = password;

  // Mettre à jour l'indicateur de force
  updateStrengthMeter();
}

// Fonction pour mettre à jour l'indicateur de force du mot de passe
function updateStrengthMeter() {
  let strength = calculatePasswordStrength();
  strengthIndicator.style.width = strength.percent + "%";
  strengthIndicator.style.backgroundColor = strength.color;
  strengthText.textContent = strength.label;
}

// Fonction pour calculer la force du mot de passe
function calculatePasswordStrength() {
  let length = parseInt(lengthSlider.value);
  let types = 0;

  if (uppercaseCheckbox.checked) types++;
  if (lowercaseCheckbox.checked) types++;
  if (numbersCheckbox.checked) types++;
  if (symbolsCheckbox.checked) types++;

  // Calcul du score basé sur la longueur et les types de caractères
  let score = 0;

  // Points pour la longueur
  if (length >= 8) score += 1;
  if (length >= 12) score += 1;
  if (length >= 16) score += 1;

  // Points pour les types de caractères
  score += types - 1; // 0 si un type, jusqu'à 3 si quatre types

  // Le score total va de 0 à 6
  let percent = (score / 6) * 100;

  // Déterminer la couleur et le label en fonction du pourcentage
  let color = "red";
  let label = "Faible";

  if (percent >= 80) {
    color = "green";
    label = "Fort";
  } else if (percent >= 50) {
    color = "orange";
    label = "Moyen";
  } else if (percent >= 30) {
    color = "yellow";
    label = "Faible";
  } else {
    color = "red";
    label = "Très faible";
  }

  return { percent, color, label };
}

// Étape 4: Fonction pour copier le mot de passe dans le presse-papiers
function copyPassword() {
  if (passwordField.value === "") {
    messageField.textContent = "Aucun mot de passe à copier !";
    return;
  }

  navigator.clipboard
    .writeText(passwordField.value)
    .then(() => {
      messageField.style.color = "green";
      messageField.textContent = "Mot de passe copié dans le presse-papiers !";
      setTimeout(() => {
        messageField.textContent = "";
        messageField.style.color = "red";
      }, 3000);
    })
    .catch((err) => {
      messageField.textContent = "Erreur lors de la copie du mot de passe.";
      console.error("Erreur lors de la copie :", err);
    });
}

// Étape 5: Ajouter des événements aux boutons
generateBtn.addEventListener("click", generatePassword);
copyBtn.addEventListener("click", copyPassword);

// Initialiser l'indicateur de force
updateStrengthMeter();
