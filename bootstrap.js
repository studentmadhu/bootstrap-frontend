// Function to validate input fields
function validateInput(inputElement, regexPattern) {
  const inputValue = inputElement.value.trim();

  if (inputValue === "") {
    inputElement.classList.remove("is-invalid");
    inputElement.classList.remove("is-valid");
  } else {
    const isValidInput = regexPattern.test(inputValue);

    if (!isValidInput) {
      inputElement.classList.add("is-invalid");
      inputElement.classList.remove("is-valid");
    } else {
      inputElement.classList.remove("is-invalid");
      inputElement.classList.add("is-valid");
    }
  }
}

// First name validation
const nameInput = document.getElementById("validationCustom01");
nameInput.addEventListener("input", function () {
  validateInput(nameInput, /^[A-Za-z]+$/);
});

// Email validation
const emailInput = document.getElementById("validationCustomEmail");
emailInput.addEventListener("input", function () {
  validateInput(emailInput, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
});

// Phone number validation
const phoneInput = document.getElementById("validationCustomPhone");
phoneInput.addEventListener("input", function () {
  validateInput(phoneInput, /^\d{10}$/);
});

// PAN card validation
const pancardInput = document.getElementById("pancard");
pancardInput.addEventListener("input", function () {
  validateInput(pancardInput, /[A-Z]{5}[0-9]{4}[A-Z]{1}/);
});

// Password validation
const passwordInput = document.getElementById("passwordInput");
passwordInput.addEventListener("input", function () {
  validateInput(
    passwordInput,
    /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,12}$/
  );
});

let imageData = null;
const fileInput = document.getElementById("imageInput");

fileInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    if (file.size <= 2 * 1024 * 1024) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function (event) {
        imageData = {
          filename: file.name,
          type: file.type,
          size: file.size,
          data: event.target.result,
        };
      };
    } else {
      alert("Select an image less than 2MB");
    }
  }
});

const submitButton = document.getElementById("value");
submitButton.addEventListener("click", handleSubmit);

function handleSubmit(event) {
  event.preventDefault();

  const names = nameInput.value;
  const email = emailInput.value;
  const contactNumber = phoneInput.value;
  const dob = document.getElementById("datePicker").value;
  const gender = document.getElementById("genderDropdown").value;
  const occupation = document.getElementById("occupationInput").value;
  const education = document.getElementById("educationDropdown").value;
  const pan = pancardInput.value;
  const password = passwordInput.value;
  const username = document.getElementById("username").value;
  if (!imageData || imageData.size === 0) {
    alert("Please select an image");
    return false;
  }

  const formData = {
    names,
    email,
    contactNumber,
    dob,
    gender,
    occupation,
    username,
    education,
    pan,
    password,
    imageData,
  };
  if (
    names.trim() === "" ||
    email.trim() === "" ||
    contactNumber.trim() === "" ||
    dob.trim() === "" ||
    username.trim() === "" ||
    pan.trim() === "" ||
    password.trim() === "" ||
    education.trim() === "" ||
    gender.trim() === ""
  ) {
    alert("Please fill in all fields ");
  } else {
    localStorage.setItem(username, JSON.stringify(formData));
    alert("Account created successfully!");
  }
}

const username1 = document.getElementById("username");
// Event listener for username input
username1.addEventListener("blur", checkUsername);

// Function to check if the username is unique
function checkUsername() {
  const username = username1.value.trim();
  if (localStorage.getItem(username)) {
    alert("Username already exists! Please choose another one.");
    username1.value = "";
    username1.focus();
  }
}

function convertToBytes(str, value) {
  const match = str.match(/\d+(\.\d+)?/); // Match numbers with optional decimals
  const unit = str.match(/[a-zA-Z]+/); // Match unit (KB, MB, bytes, etc.)

  if (match) {
    let bytes = parseFloat(match[0].trim()); //value
    const unitStr = unit[0].toLowerCase().trim(); //string

    switch (unitStr) {
      case "kb":
        bytes *= 1000;
        if (bytes >= value) {
          return true;
        }
      case "mb":
        bytes *= 1000 * 1000;
        console.log(bytes);
        if (bytes >= value) {
          return true;
        }
      default:
        if (bytes >= value) {
          return bytes;
        }
        break;
    }
  } else {
    return null;
  }
}

function calculateAgeFromDays(days) {
  // Get the current date
  var value = days / 365;
  let age = Math.round(value) - 1;
  return age;
}

function calculateAging(dobString) {
  // Split the DOB string into year, month, and day components
  const dobComponents = dobString.split("-");
  const year = parseInt(dobComponents[0]);
  const month = parseInt(dobComponents[1]);
  const day = parseInt(dobComponents[2]);

  // Create a date object representing the current date
  const currentDate = new Date();

  // Create a date object representing the birth date
  const birthDate = new Date(year, month - 1, day);

  // Calculate the difference in years between the current date and the birth date
  let age = currentDate.getFullYear() - birthDate.getFullYear();

  // Check if the current date has passed the birthday for this year
  if (
    currentDate.getMonth() < birthDate.getMonth() ||
    (currentDate.getMonth() === birthDate.getMonth() &&
      currentDate.getDate() < birthDate.getDate())
  ) {
    // If the birthday for this year hasn't occurred yet, decrement the age by 1
    age--;
  }

  return age;
}

function checkSuffix(str, suffixes) {
  const trimmedStr = str.toLowerCase().trim();
  return suffixes.some((suffix) => trimmedStr.endsWith(suffix));
}

const searchButton = document.getElementById("button-addon2");
const searchInput = document.getElementById("search-bar");
const tableContainer = document.getElementById("table-container");

function performSearch() {
  const searchValue = searchInput.value.trim();

  if (searchValue.length === 0) {
    tableContainer.innerHTML = "";
    return; // Stop further execution
  }

  const matchingKeys = [];

  // Iterate through all entries in localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const storedValue = localStorage.getItem(key);
    const userData = JSON.parse(storedValue);

    if (
      userData.names
        .toLowerCase()
        .trim()
        .includes(searchValue.toLowerCase().trim())
    ) {
      matchingKeys.push(userData);
    } else if (
      checkSuffix(searchValue, ["days", "day"]) ||
      !isNaN(searchValue)
    ) {
      if (
        calculateAging(userData.dob) <=
        calculateAgeFromDays(parseInt(searchValue))
      ) {
        matchingKeys.push(userData);
      }
    } else if (checkSuffix(searchValue, ["mb", "kb", "bytes"])) {
      const imageSizeInBytes = userData.imageData.size;
      if (convertToBytes(searchValue, imageSizeInBytes)) {
        matchingKeys.push(userData);
      }
    }
  }
  console.log(matchingKeys);

  if (matchingKeys.length === 0) {
    alert("User is not found");
  } else {
    generateTable(matchingKeys);
  }
}

searchButton.addEventListener("click", performSearch);

searchInput.addEventListener("input", () => {
  if (searchInput.value.trim().length === 0) {
    performSearch();
  }
});

function generateTable(userDataArray) {
  tableContainer.innerHTML = "";
  userDataArray.forEach((userDatas, index) => {
    const userDataDiv = document.createElement("div");
    userDataDiv.classList.add("user-data");

    // Append user data items with labels
    for (const [key, value] of Object.entries(userDatas)) {
      const item = document.createElement("div");
      item.classList.add("user-data-item");

      // Special handling for image data
      if (key === "imageData") {
        const img = document.createElement("img");
        img.src = value.data; // Assuming value is an object with a 'data' property containing the image data
        img.width = 100; // Example width
        img.height = 100; // Example height
        item.appendChild(img);
      } else {
        item.innerHTML = `<span class="label">${key}:</span> <span class="value">${value}</span>`;
      }

      userDataDiv.appendChild(item);
    }

    // Add separating line between user data
    if (index !== userDataArray.length - 1) {
      const line = document.createElement("hr");
      userDataDiv.appendChild(line);

      // Add vertical line using CSS
      userDataDiv.style.position = "relative";
      userDataDiv.style.paddingRight = "20px"; // Adjust as needed

      const verticalLine = document.createElement("div");
      verticalLine.classList.add("vertical-line");
      userDataDiv.appendChild(verticalLine);
    }

    // Append user data to table container
    tableContainer.appendChild(userDataDiv);
  });
}
