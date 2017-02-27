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
      var $show = $("[data-sticky-header-show='" + tracking + "']");

      // if($show.length){
      //   Cookies.remove("sticky-header");
        $show.show();
      // }
    }

    $("body").on("click", "[data-sticky-header-trigger]", function () {
      var value = $(this).data("sticky-header-trigger");
      console.log(value);
      Cookies.set("sticky-header", value);
    });
  }

  return {
    init: init
  }
});