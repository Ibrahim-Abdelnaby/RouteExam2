"use strict";

// Hide spinner 
function hideOuterSpinner() {
  $(".loadingScreen").fadeOut(500, (e) => {
    $("body").addClass("overflow-visible").removeClass("overflow-hidden");
  });
}

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
}