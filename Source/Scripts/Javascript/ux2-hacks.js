/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */
/*global Cookies */

// Throw-away work intended only for frontend prototypes
sageApp.modules.register("ux2Hacks", function ($) {
  "use strict";

  function init() {
    stickyHeaderTracking();
  }

  function stickyHeaderTracking() {
    var tracking = Cookies.get("sticky-header");

    if (tracking !== void 0) {
      $("[data-sticky-header-show='" + tracking + "']").show();
    }

    $("body").on("click", "[data-sticky-header-trigger]", function () {
      var value = $(this).data("sticky-header-trigger");
      $("[data-sticky-header-show='" + tracking + "']").show();
      Cookies.set("sticky-header", value);
    });

    $("body").on("click", "[data-sticky-header-close]", function () {
      var value = $(this).data("sticky-header-close");
      Cookies.remove("sticky-header");
      $("[data-sticky-header-show='" + value + "']").hide();
    });
  }

  return {
    init: init
  }
});