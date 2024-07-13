"use strict";

// --------------------------------------------------------------------------------

// Hide spinner 
function hideOuterSpinner() {
  $(".loadingScreen").fadeOut(500, (e) => {
    $("body").addClass("overflow-visible").removeClass("overflow-hidden");
  });
};

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

// Closes side nav
function closeSideNav() {
  $(".menuIcon").addClass("fa-bars").removeClass("fa-xmark");
  $("header").animate({ left: `${-navWidth}` }, 500);
  navLinks.animate({ top: "280px" }, 500);
};

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