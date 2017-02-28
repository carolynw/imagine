/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */
/*global Cookies */

sageApp.modules.register("ux2Hacks", function ($) {
  "use strict";

  function init() {
    stickyHeaderTracking();
  }

  // Hack using javascript cookies to get the "sticky header" functionality working in certain pages
  function stickyHeaderTracking() {
    var tracking = Cookies.get("sticky-header");

    if (tracking !== void 0) {
      $("[data-sticky-header-show='" + tracking + "']").addClass("open");
    }

    $("body").on("click", "[data-sticky-header-trigger]", function () {
      var value = $(this).data("sticky-header-trigger");
      $("[data-sticky-header-show='" + tracking + "']").addClass("open");
      Cookies.set("sticky-header", value);
    });

    $("body").on("click", "[data-sticky-header-close]", function (event) {
      event.preventDefault();
      var value = $(this).data("sticky-header-close");
      Cookies.remove("sticky-header");
      $("[data-sticky-header-show='" + value + "']").removeClass("open");
    });

    new Waypoint.Inview({
      element: $("[data-sticky-header-autoclose]")[0],
      entered: function () {
        var value = $(this.element).data("sticky-header-autoclose");
        $("[data-sticky-header-show='" + value + "'] .sticky-header-inner").addClass("soft-hide");
      },
      exited: function () {
        var value = $(this.element).data("sticky-header-autoclose");
        $("[data-sticky-header-show='" + value + "'] .sticky-header-inner.soft-hide").removeClass("soft-hide");
      }
    });
  }

  return {
    init: init
  }
});