/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("ux2Nav", function ($) {
  "use strict";

  function init() {
    var $sideNav = $("#ux2_side_nav");
    var $headerNav = $("#page_header_nav");

    $headerNav.on("click", "[data-togglecssclass]", function(event){
      event.preventDefault();
      $("body").addClass("no-scroll");
      $sideNav.addClass("open");
    });

    $sideNav.on("click", ".navbar-close", function(event){
      event.preventDefault();
      $("body").removeClass("no-scroll");
      $sideNav.removeClass("open");
    });

    $sideNav.on("click", ".section-header", function(event){
      event.preventDefault();
      $(this).closest(".section").toggleClass("open");
    })
  }

  return {
    init: init
  }
});