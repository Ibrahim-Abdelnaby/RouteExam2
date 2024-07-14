"use strict";

// --------------------------------------------------------------------------------

// Hide spinner 
function hideOuterSpinner() {
  $(".loadingScreen").fadeOut(500, (e) => {
    $("body").addClass("overflow-visible").removeClass("overflow-hidden");
  });
};

// --------------------------------------------------------------------------------

// Display spinner when navigateing
function displayInnerSpinner() {
  $("body").addClass("overflow-hidden");
  $(".loadingScreen").css({ display: "block" });
  $(document).ready(function () {
    $(".loadingScreen").fadeOut(1000, (e) => {
      $("body").addClass("overflow-visible").removeClass("overflow-hidden");
    });
  });

  // Changeing the Z-Index
  $(".loadingScreen").css({ zIndex: "500" });
};

// --------------------------------------------------------------------------------

// Side navbar width
const navWidth = $("header").width() - 60;
const navLinks = $(".nav-item");

// Open side nav
function openSideNav() {
  $(".menuIcon").addClass("fa-xmark").removeClass("fa-bars");
  $("header").animate({ left: "0" }, 500);
  for (let i = 0; i < navLinks.length; i++) {
    navLinks.eq(i).animate({ top: "0" }, (i + 4) * 120);
  }
};

// --------------------------------------------------------------------------------

// Closes side nav
function closeSideNav() {
  $(".menuIcon").addClass("fa-bars").removeClass("fa-xmark");
  $("header").animate({ left: `${-navWidth}` }, 500);
  navLinks.animate({ top: "280px" }, 500);
};

// --------------------------------------------------------------------------------

// Change menuIcon 
$(".menuBtn").click((e) => {
  e.preventDefault();

  if ($(".menuIcon").hasClass("fa-bars") === true) {
    openSideNav();
  } else {
    closeSideNav();
  }
});

// --------------------------------------------------------------------------------

// GET aLL data from API
let mealsDetails;
async function getMealsData(link, objName) {
  const ApiDate = await fetch(link);
  const MealsData = await ApiDate.json();

  mealsDetails = MealsData[`${objName}`];
};

// --------------------------------------------------------------------------------

// Hides part of a page
function hideSec(section) {
  $(section).empty();
};

// --------------------------------------------------------------------------------

// Display only 20 meals
function displayMeals(arr) {
  arr.map((meal, index) => {
    if (index < 20) {
      $(".mealSec .mealsContainer").append(`
          <div
          class="col-md-6 col-lg-4 col-xl-3"
        >
          <div class="mealInfo singleMeal position-relative overflow-hidden rounded-3">
            <img src='${meal.strMealThumb}' loading="lazy" alt="${meal.strMeal} meal photo" class="w-100" />
            <div
              class="mealOverlay position-absolute start-0 top-100 end-0 d-flex justify-content-center align-items-center"
            >
              <h2 class="fw-bold text-black text-center fs-3 px-2">${meal.strMeal}</h2>
            </div>
          </div>
        </div>
          `);
    }
  });
}

// --------------------------------------------------------------------------------

// Display serach
function displaySearchSec() {
  $('.nav-link[href="#search"]').click((e) => {
    closeSideNav();
    displayInnerSpinner();
    // Jump to top
    $("body, html").animate({ scrollTop: "0" }, 300);
    hideSec(".mealsContainer");
    hideSec(".signUpForm");
    $(".searchForm").html(`
        <div class=" row g-4 pt-5">
        <div class="col-md-5 offset-md-1">
              <div class="formInputs">
                <input
                  type="text"
                  class="form-control bg-transparent text-light"
                  placeholder="Search By Name"
                  name="nameSearch"
                  id = "searchedName"
                />
              </div>
            </div>
            <div class="col-md-5">
              <div class="formInputs">
                <input
                  type="text"
                  class="form-control bg-transparent text-light"
                  placeholder="Search By First Letter"
                  name="fLetterSearch"
                  id = "searchedLetter"
                  maxlength = 1
                />
              </div>
            </div>
            </div>
        `);

    displayMatchedName();
    displayMatchedLetter();
  });
}

// --------------------------------------------------------------------------------

// Display matched names
function displayMatchedName() {
  let inputName = $("#searchedName");
  inputName.keyup(async (e) => {
    const searchName = inputName.val();
    await getMealsData(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchName}`,
      "meals"
    );
    $(document).ready(function () {
      displayInnerSpinner();
      $(".mealSec .mealsContainer").html(``);
      displayMeals(mealsDetails);
      displayMealInfo(mealsDetails);
    });
  });
}

// --------------------------------------------------------------------------------

// Display matched first letter
function displayMatchedLetter() {
  let inputLetter = $("#searchedLetter");
  inputLetter.keyup(async (e) => {
    const firstLetter = inputLetter.val();
    // Set first letter to "a" (empty input, ternary)
    firstLetter !== ""
      ? await getMealsData(
        `https://www.themealdb.com/api/json/v1/1/search.php?f=${firstLetter}`,
        "meals"
      )
      : await getMealsData(
        `https://www.themealdb.com/api/json/v1/1/search.php?f=a`,
        "meals"
      );
    $(document).ready(function () {
      displayInnerSpinner();
      $(".mealSec .mealsContainer").html(``);
      displayMeals(mealsDetails); // Display filtered meals
      displayMealInfo(mealsDetails); // Show meal details (on click)
    });
  });
}

// --------------------------------------------------------------------------------

// Show/hide categories
function displayCategories() {
  $('.nav-link[href="#categories"]').click(async (e) => {
    closeSideNav();
    // Jump to top
    $("body, html").animate({ scrollTop: "0" }, 300);
    $(".mealsContainer").html("");
    hideSec(".searchForm");
    hideSec(".signUpForm");
    await getMealsData(
      "https://www.themealdb.com/api/json/v1/1/categories.php",
      "categories"
    );
    $(document).ready(function () {
      displayInnerSpinner();

      mealsDetails.map((categ, index) => {
        // Max 20 categories
        if (index < 20) {

          $(".mealsContainer").append(`
          <div
          class="col-md-6 col-lg-4 col-xl-3"
        >
          <div class="mealCateg position-relative overflow-hidden rounded-3">
            <img src='${categ.strCategoryThumb}' loading="lazy" alt="${categ.strCategory
            } meal photo" class="w-100" />
            <div
              class="mealOverlay position-absolute start-0 end-0 d-flex justify-content-center align-items-center text-center"
            >
            <div>
              <h2 class="fw-bold text-black fs-3 px-2">${categ.strCategory}</h2>
              <p class="my-2 text-dark">${categ.strCategoryDescription.slice(
              0,
              150
            )}...</p>
            </div>
            </div>
          </div>
        </div>
          `);
        }
      });
      // Filter meals by category
      getMatchedMeal(mealsDetails, ".mealCateg", "c", "strCategory");
    });
  });
}

// --------------------------------------------------------------------------------

// Show/hide areas (nav link click)
function displayAreas() {
  $('.nav-link[href="#area"]').click(async (e) => {
    $(".mealsContainer").html("");
    closeSideNav();
    // Jump to top
    $("body, html").animate({ scrollTop: "0" }, 300);
    hideSec(".searchForm");
    hideSec(".signUpForm");
    await getMealsData(
      `https://www.themealdb.com/api/json/v1/1/list.php?a=list`,
      "meals"
    );
    $(document).ready(function () {
      displayInnerSpinner();

      mealsDetails.map((area) => {
        $(".mealsContainer").append(`
          <div
          class="col-6 col-md-4 col-lg-3"
        >
          <div class="mealArea text-center">
          <i class="fa-solid fa-house-laptop"></i>
          <p class="fs-3 fw-semibold my-0">${area.strArea}</p>
          </div>
        </div>
          `);
      });
      // Filter meals by area
      getMatchedMeal(mealsDetails, ".mealArea", "a", "strArea");
    });
  });
}

// --------------------------------------------------------------------------------

// Show/hide ingradients (nav link click)
function displayIngradients() {
  $('.nav-link[href="#ingradients"]').click(async (e) => {
    $(".mealsContainer").html("");
    closeSideNav();
    // Jump to top
    $("body, html").animate({ scrollTop: "0" }, 300);
    hideSec(".searchForm");
    hideSec(".signUpForm");
    await getMealsData(
      `https://www.themealdb.com/api/json/v1/1/list.php?i=list`,
      "meals"
    );
    $(document).ready(function () {
      displayInnerSpinner();
      mealsDetails.map((ingradient, index) => {
        // Max 20 ingradients
        if (index < 20) {

          $(".mealsContainer").append(`
          <div
          class="col-md-6 col-lg-3"
        >
          <div class="mealIngradient text-center">
          <i class="fa-solid fa-drumstick-bite"></i>
          <h3 class="my-2">${ingradient.strIngredient}</h3>
          <p class="fw-semibold my-0">${ingradient.strDescription.substring(
            0,
            130
          )}...</p>
          </div>
        </div>
          `);
        }
      });
      // Filter meals by ingradient
      getMatchedMeal(mealsDetails, ".mealIngradient", "i", "strIngredient");
    });
  });
}

// --------------------------------------------------------------------------------

// Display meal information 
function displayMealInfo(arr) {
  let mealSing = $(".singleMeal");
  for (let i = 0; i < mealSing.length; i++) {
    mealSing[i].addEventListener("click", (e) => {
      closeSideNav();
      hideSec(".searchForm");
      hideSec(".signUpForm");
      // Jump to top
      $("body, html").animate({ scrollTop: "0" }, 300);
      $(".mealsContainer").html("");

      $(document).ready(function () {
        displayInnerSpinner();
        appendMealInfo(arr, i);
      });
    });
  }
}

// --------------------------------------------------------------------------------

// Append meals info
function appendMealInfo(arr, i) {
  displayInnerSpinner();
  // Jump to top
  $("body, html").animate({ scrollTop: "0" }, 300);
  $(".mealsContainer").html(`
          <div class="col-md-4">
            <div class="mealDetails text-light text-center">
              <img src="${arr[i].strMealThumb}" loading="lazy" alt="${arr[i].strMeal} meal photo" class="w-100 rounded-3" />
              <h1 class="text-capitalize fw-bold mt-2">${arr[i].strMeal}</h1>
            </div>
          </div>
          <div class="col-md-8">
            <div class="mealInst text-light">
              <h2 class="fw-bold">Instructions</h2>
              <p class="fs-5 mt-2 mb-4">
                ${arr[i].strInstructions}
              </p>
              <p class="fs-3 fw-bold my-2">
                Area:&nbsp;<span class="text-capitalize fw-semibold fs-4"
                  >${arr[i].strArea}</span
                >
              </p>
              <p class="fs-3 fw-bold my-2">
                Category:&nbsp;<span class="text-capitalize fw-semibold fs-4"
                  >${arr[i].strCategory}</span
                >
              </p>
              <p class="fs-3 fw-bold my-2">Recipes:</p>
              <ul class="px-1 list-unstyled d-flex flex-wrap gap-2 recipies">
              </ul>
              <p class="fs-3 fw-bold mt-3 mb-2">Tags:</p>
              <ul class="list-unstyled d-flex flex-wrap gap-2 px-1 g-4 tags">
              </ul>
             <div class="my-4">
             <a
             href="${arr[i].strSource}" target="_blank"
             class="btn btn-success fw-semibold fs-6 d-inline-block me-1"
             >Source</a
           >
           <a
             href="${arr[i].strYoutube}" target="_blank"
             class="btn btn-danger fw-semibold fs-6 d-inline-block me-1"
             >Youtube</a
           >
             </div>
            </div>
          </div>
          `);

  // Limit ingredient list to 20
  for (let j = 1; j < 21; j++) {
    if (arr[i][`strIngredient${j}`] !== "") {
      $(".recipies").append(`
                    <li class="recipe alert alert-info fw-medium p-2 rounded-2 flex-wrap">
                      ${arr[i][`strMeasure${j}`]} ${arr[i][`strIngredient${j}`]}
                  </li>
            `);
    }
  }

  // Handle meals without tags to avoid errors
  if (arr[i].strTags !== null) {
    // Display tags in a user-friendly format
    let mealTags = arr[i].strTags.split(",");
    mealTags.map((tag) => {
      $(".tags").append(`
                  <li class="tag alert alert-danger fw-medium p-2 rounded-2">${tag}</li>
          `);
    });
  } else {
    $(".tags").html(`
                  <li class="tag alert alert-danger fw-medium p-2 rounded-2">
                    No tags available
                </li>
            `);
  }
}

// --------------------------------------------------------------------------------

// Stores meals matching clicked category
let matchedMeals;

function getMatchedMeal(arr, element, filter, item) {
  // Jump to top
  $("body, html").animate({ scrollTop: 0 }, 300);

  const singleItem = $(element);

  // Loop categories for clicks and API calls
  singleItem.each(function (i) {
    $(this).click(async (e) => {
      const apiData = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?${filter}=${arr[i][item]}`
      );
      const mealsData = await apiData.json();

      matchedMeals = mealsData.meals; // Update matched meals

      // Clear and display filtered meals
      $(".mealSec .mealsContainer").html("");
      displayMeals(matchedMeals);

      // Handle meal details on click
      searchMealById();
    });
  });
}

// --------------------------------------------------------------------------------

// Get details of a single meal by ID
let searchedMeal;

function searchMealById() {
  // Jump to top
  $("body, html").animate({ scrollTop: 0 }, 300);

  const mealSing = $(".singleMeal");

  mealSing.each(function (i) {
    $(this).click(async (e) => {
      const apiData = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${matchedMeals[i].idMeal}`
      );
      const mealsData = await apiData.json();

      searchedMeal = mealsData.meals;

      $(document).ready(function () {
        displayInnerSpinner();
        appendMealInfo(searchedMeal, 0);
      });
    });
  });
}

// --------------------------------------------------------------------------------

function displaySignUpSec() {
  $('.nav-link[href="#contact"]').click((e) => {
    closeSideNav();
    $(document).ready(function () {
      displayInnerSpinner(); // Jump to top
      $("body, html").animate({ scrollTop: "0" }, 300);
      hideSec(".mealsContainer");
      hideSec(".searchForm");
      $(".signUpForm").css({ marginTop: "100px" });
      $(".signUpForm").html(`
        <form method="post" class="py-4">
          <div class="row g-4">
          <div class="col-md-5 offset-md-1">
            <div class="formInput">
              <input
                type="text"
                class="form-control bg-transparent text-light fName"
                placeholder="Enter Your Name"
                name="FullName"
              />
              <p class="nameAlert alert alert-danger rounded-3 mb-4 mt-3 p-1 border-0 d-none text-center"></p>
            </div>
          </div>
          <div class="col-md-5">
            <div class="formInput">
              <input
                type="email"
                class="form-control bg-transparent text-light email"
                placeholder="Enter Your Email"
                name="email"
              />
              <p class="emailAlert alert alert-danger rounded-3 mb-4 mt-3 p-1 border-0 d-none text-center"></p>
            </div>
          </div>
          <div class="col-md-5 offset-md-1">
            <div class="formInput">
              <input
                type="tel"
                class="form-control bg-transparent text-light mobileNo"
                placeholder="Enter your Phone"
                name="phoneNo"
              />
              <p class="phoneAlert alert alert-danger rounded-3 mb-4 mt-3 p-1 border-0 d-none text-center"></p>         
              </div>
          </div>
          <div class="col-md-5">
            <div class="formInput">
              <input
                type="number"
                class="form-control bg-transparent text-light age"
                placeholder="Enter Your Age"
                name="age"
              />
              <p class="ageAlert alert alert-danger rounded-3 mb-4 mt-3 p-1 border-0 d-none text-center"></p>         </div>
          </div>
          <div class="col-md-5 offset-md-1">
            <div class="formInput">
              <input
                type="password"
                class="form-control bg-transparent text-light pass"
                placeholder="Enter Your Password"
                name="pass"
              />
              <p class="passAlert alert alert-danger rounded-3 mb-4 mt-3 p-1 border-0 d-none text-center"></p>         </div>
          </div>
          <div class="col-md-5">
            <div class="formInput">
              <input
                type="password"
                class="form-control bg-transparent text-light rePass"
                placeholder="RePassword"
                name="rePass"
              />
              <p class="rePassAlert alert alert-danger rounded-3 mb-4 mt-3 p-1 border-0 d-none text-center"></p>         </div>
          </div>
        </div>
        <div class="submitBtn text-center my-4">
          <button
            type="submit"
            class="btn fw-semibold btn-outline-warning px-5"
          >
            Submit
          </button>
        </div>
        </form>
          `);

      // First Validation
      fireValidation();

      $(".signUpForm form").submit((e) => {
        e.preventDefault();
      });
    });
  });
}

// --------------------------------------------------------------------------------  

// Validate Data
function validateName() {
  const regex = /^[A-Za-z][\sa-zA-Z]{0,}$/gm;
  return regex.test($(".fName").val());
}
function validateEmail() {
  const regex = /^.{0,}@[A-Za-z0-9-\.]{1,}\.[A-Za-z]{2,}$/gm;
  return regex.test($(".email").val());
}

function validateMob() {
  const regex = /^(\+2){0,1}(01)[0125][0-9]{8}$/gm;
  return regex.test($(".mobileNo").val());
}

function validateAge() {
  const regex = /^[1-9][0-9]{0,1}$/gm;
  return regex.test($(".age").val());
}

function validatePass() {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/gm;
  return regex.test($(".pass").val());
}
function iaPassMatched() {
  if ($(".rePass").val() === $(".pass").val()) {
    return true;
  }
}

// --------------------------------------------------------------------------------  

// Accept Valid Data
function acceptData() {
  if (
    validateName() === true &&
    validateEmail() === true &&
    validateMob() === true &&
    validateAge() === true &&
    validatePass() === true &&
    iaPassMatched() === true
  ) {
    $(".submitBtn button").removeAttr("disabled");
  } else {
    $(".submitBtn button").attr("disabled", "disabled");
  }
}

// --------------------------------------------------------------------------------  

function fireValidation() {
  $(document).ready(function () {
    $(".submitBtn button").attr("disabled", "disabled");
    $(".fName").keyup((e) => {
      validateInputs(
        validateName,
        ".nameAlert",
        `Special characters and numbers not allowed`
      );
    });
    $(".email").keyup((e) => {
      validateInputs(
        validateEmail,
        ".emailAlert",

        `Email not valid *exemple@yyy.zzz`
      );
    });
    $(".mobileNo").keyup((e) => {
      validateInputs(
        validateMob,
        ".phoneAlert",

        `Enter valid Phone Number
            `
      );
    });
    $(".age").keyup((e) => {
      validateInputs(
        validateAge,
        ".ageAlert",

        `Enter valid age
            `
      );
    });
    $(".pass").keyup((e) => {
      validateInputs(
        validatePass,
        ".passAlert",

        `Enter valid password *Minimum eight characters, at least one letter and one number`
      );
    });
    $(".rePass").keyup((e) => {
      validateInputs(
        iaPassMatched,
        ".rePassAlert",

        `Password does not match`
      );
    });
  });
}

// --------------------------------------------------------------------------------  

// Alert Message
function validateInputs(func, alert, msg) {
  $(alert).removeClass("d-block").addClass("d-none");
  if (func() === true) {
    $(alert).removeClass("d-block").addClass("d-none");
  } else if (func() !== true) {
    $(alert).removeClass("d-none").addClass("d-block");
    $(alert).html(msg);
  }

  // Accept Valid Data 
  acceptData();
}

// --------------------------------------------------------------------------------  

// Calling Functions
async function displayAllData() {
  await getMealsData(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=",
    "meals"
  );

  $(document).ready(function () {
    // Display all meals in home page
    displayMeals(mealsDetails);

    // Smooth loading transition
    hideOuterSpinner();

    // Display Search Inputs + Hide meals
    displaySearchSec();

    // Display meals category 
    displayCategories();

    // Display meals areas
    displayAreas();

    // Display meals ingradients
    displayIngradients();

    // Display signUp From
    displaySignUpSec();

    // Display meal info
    displayMealInfo(mealsDetails);
  });
}

displayAllData();

// --------------------------------------------------------------------------------  