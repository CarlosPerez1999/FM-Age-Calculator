const inputDay = document.getElementById("inputDay");
const inputMonth = document.getElementById("inputMonth");
const inputYear = document.getElementById("inputYear");

const inputs = [
  {
    element: inputDay,
    errorMsg: "Must be a valid day",
    errorEl: document.getElementById("errorDay"),
  },
  {
    element: inputMonth,
    errorMsg: "Must be a valid month",
    errorEl: document.getElementById("errorMonth"),
  },
  {
    element: inputYear,
    errorMsg: "Must be in the past",
    errorEl: document.getElementById("errorYear"),
  },
];

const calculateButton = document.getElementById("calculate-btn");

const resultDay = document.getElementById("days-text");
const resultMonth = document.getElementById("months-text");
const resultYear = document.getElementById("years-text");

const monthsWith31Days = [1, 3, 5, 7, 8, 10, 12];

// Check if the year is a leap year
const isALeapYear = (year) => {
  if (year <= 0) return false; // Year should be a positive integer
  if (year % 100 === 0 && year % 400 === 0) {
    return true;
  } else {
    if (year % 4 === 0) {
      return true;
    } else {
      return false;
    }
  }
};

// Get the number of days in a month based on the month and year
const numberOfDays = (month, year) => {
  if (month === 2) {
    return isALeapYear(year) ? 29 : 28; // Leap year logic for February
  } else if (monthsWith31Days.includes(month)) {
    return 31; // Months with 31 days
  } else {
    return 30; // All other months have 30 days
  }
};

// Validate the day, month, and year to ensure they form a valid date
const validateDate = (day, month, year) => {
  if (
    !Number.isInteger(day) ||
    !Number.isInteger(month) ||
    !Number.isInteger(year)
  ) {
    return false; // Ensure values are integers
  }

  if (year < 1 || year > new Date().getFullYear()) {
    return false; // Year should be in the past
  }

  if (month < 1 || month > 12) {
    return false; // Month should be between 1 and 12
  }

  const maxDays = numberOfDays(month, year);

  if (day < 1 || day > maxDays) {
    return false; // Day should be within the valid range for the given month
  }

  return true;
};

// Add event listener to validate each input when changed
inputs.forEach(({ element, errorMsg, errorEl }) => {
  let isDirty = false;

  element.addEventListener("change", () => {
    if (!isDirty) isDirty = true; // Ensure the input is marked as dirty once modified

    const value = parseInt(element.value);
    const currentYear = new Date().getFullYear();
    const inputId = element.id;

    if (isNaN(value) || value <= 0) {
      element.classList.add("input-error");
      errorEl.innerText = errorMsg;
      return;
    }

    // Switch statement to handle specific validation based on the input ID
    switch (inputId) {
      case "inputDay":
        if (value < 1 || value > 31) {
          element.value = "";
          element.classList.add("input-error");
          errorEl.innerText = errorMsg;
          return;
        }
        break;
      case "inputMonth":
        if (value < 1 || value > 12) {
          element.value = "";
          element.classList.add("input-error");
          errorEl.innerText = errorMsg;
          return;
        }
        break;
      case "inputYear":
        if (value > currentYear) {
          element.value = "";
          element.classList.add("input-error");
          errorEl.innerText = "Year must not be in the future";
          return;
        }
        break;
    }

    element.classList.remove("input-error");
    errorEl.innerText = "";
  });
});

// Function to calculate age based on the provided day, month, and year
const calculateAge = () => {
  const day = parseInt(inputDay.value);
  const month = parseInt(inputMonth.value);
  const year = parseInt(inputYear.value);

  if ([day, month, year].some((value) => isNaN(value))) return; // Ensure all values are numbers

  const maxDays = numberOfDays(month, year);

  if (!validateDate(day, month, year, maxDays)) return; // Validate the date before proceeding

  const birthDate = new Date(year, month - 1, day); // Create a date object for the birthdate
  const today = new Date(); // Get the current date

  if (birthDate > today) return; // Ensure the birthdate is not in the future

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  // Adjust days and months if necessary
  if (days < 0) {
    months -= 1;
    const prevMonth = today.getMonth() === 0 ? 12 : today.getMonth();
    const prevYear =
      prevMonth === 12 ? today.getFullYear() - 1 : today.getFullYear();
    days += numberOfDays(prevMonth, prevYear);
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  resultYear.innerText = years;
  resultMonth.innerText = months;
  resultDay.innerText = days;
};

// Add event listener to calculate age when the button is clicked
calculateButton.addEventListener("click", calculateAge);
