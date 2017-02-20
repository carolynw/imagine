/*jslint browser: true*/
/*jslint jquery: true*/
/*global jQuery */
/*global sageApp */

sageApp.modules.register("productFilter", function ($) {
  "use strict";

  var moduleClass = "filter-module-content:not(.partners)",
    filterButtonsClass = "product-filter-icon-wrapper",
    activeClass = "active",
    productResultsListClass = "filter-module-results-list",
    productPanelClass = "product-panel",
    filterTableClass = "filter-module-results-table",
    productPanelDisabledClass = "panel-disabled",
    sageCompareControl = {},
    isFiltered = false;

  function init() {
    //bind all events to document for delagation to traget product-filter-icon-wrapper
    $(document).on("click", "." + moduleClass + " ." + filterButtonsClass, function (e) {
      e.preventDefault();
      filterIconClicked(e.currentTarget);
    });
    $(document).on("click", "." + moduleClass + " ." + "product-select-icon", function (e) {
      e.preventDefault();
      selectIconClicked(e.currentTarget);
    });
    $(document).on("click", "." + moduleClass + " ." + "mob-trigger", function (e) {
      e.preventDefault();
      mobileProductClicked(e.currentTarget);
    });
    $(document).on("click", "." + moduleClass + " ." + "navigation", function (e) {
      e.preventDefault();
      navigationClicked(e.currentTarget);
    });

    if (!$("div." + productResultsListClass).length)
      return;

    initProdSlider();
  }

  function toggleNavigationDisabled() {
    var filteredProducts = $("." + moduleClass + " .mobile-table-header > .mob-trigger.isFiltered"),
      numFilteredProducts = filteredProducts.length,
      activeProductposition = 1,
      tmpCounter = 1;

    filteredProducts.each(function () {
      if ($(this).hasClass(activeClass)) {
        activeProductposition = tmpCounter;
      }
      tmpCounter++;
    });

    $("." + moduleClass + " ." + "navigation").removeClass("disabled");

    if (activeProductposition === numFilteredProducts) {
      $("." + moduleClass + " ." + "navigation.btnNext").addClass("disabled");
    }
    if (activeProductposition === 1) {
      $("." + moduleClass + " ." + "navigation.btnPrevious").addClass("disabled");
    }
  }

  function navigationClicked(clickedItem) {
    var currentProduct = $("." + moduleClass + " .mobile-table-header > .mob-trigger.isFiltered.active");

    if ($(clickedItem).hasClass("btnNext")) {

      currentProduct.nextAll(".isFiltered").first().trigger("click");
    } else {

      currentProduct.prevAll(".isFiltered").first().trigger("click");
    }

    toggleNavigationDisabled();
  }

  function mobileProductClicked(clickedItem) {
    var targetID = $(clickedItem).attr("data-prod-target");
    $("." + moduleClass + " ." + "mob-trigger").removeClass(activeClass);
    $(clickedItem).addClass(activeClass);
    $("." + moduleClass + " ." + "slider-mobile").removeClass(activeClass);
    $("#" + targetID).addClass(activeClass);
  }

  function mobileProductUnClicked(clickedItem) {
    var targetID = $(clickedItem).attr("data-prod-target");
    $(clickedItem).removeClass(activeClass);
    $("#" + targetID).removeClass(activeClass);
    var numActive = $("." + moduleClass + " ." + "mob-trigger.isFiltered.active").length;

    if (numActive === 0) {
      $("." + moduleClass + " ." + "mob-trigger.isFiltered").first().addClass(activeClass);
    }
  }

  function updateFilterTable() {
    var activeProducts = $("." + productResultsListClass + " ." + productPanelClass + " .icon-select-text" + "." + activeClass),
      numActiveProducts = activeProducts.length,
      allProducts = $("." + productResultsListClass + " ." + productPanelClass),
      allProductClasses = [],
      selectedProductClasses = [];

    activeProducts.each(function () {
      var productActive = $(this).closest("." + productPanelClass).attr("data-filter-product");
      selectedProductClasses.push(productActive);
    });

    allProducts.each(function () {
      var productActive = $(this).attr("data-filter-product");
      allProductClasses.push(productActive);
    });

    var testProd = -1;
    for (var i = allProductClasses.length; i--;) {
      testProd = selectedProductClasses.indexOf(allProductClasses[i]);
      if (testProd === -1) {
        $("." + filterTableClass).removeClass(allProductClasses[i]);
      } else {
        $("." + filterTableClass).addClass(allProductClasses[i]);
      }
    }

    var slickFilterString = "";
    for (var i2 = selectedProductClasses.length; i2--;) {
      if (i2 !== 0) {
        slickFilterString = slickFilterString + "div." + selectedProductClasses[i2].replace("-active", "-mob") + ", ";
      } else {
        slickFilterString = slickFilterString + "div." + selectedProductClasses[i2].replace("-active", "-mob");
      }
    }

    if (numActiveProducts > 0) {
      $("." + filterTableClass).removeClass("hidden");
      filterProductsMobile(slickFilterString);

    } else {
      $("." + filterTableClass).addClass("hidden");
      removeProductFilters();
    }
  }

  function selectIconClicked(clickedItem) {
    $(clickedItem).toggleClass(activeClass);
    $(clickedItem).closest(".panel").next(".icon-select-text").toggleClass(activeClass);

    if ($(clickedItem).closest(".panel").next(".icon-select-text").hasClass(activeClass)) {
      mobileProductClicked(".mobile-table-header" + " ." + $(clickedItem).closest(".product-panel").attr("data-prod-target"));
    } else {
      mobileProductUnClicked(".mobile-table-header" + " ." + $(clickedItem).closest(".product-panel").attr("data-prod-target"));
    }
    updateFilterTable();
    toggleNavigationDisabled();
  }

  function filterIconClicked(clickedItem) {
    $(clickedItem).toggleClass(activeClass);
    updateSelectedProducts();
  }


  function removeProductFilters() {
    if (isFiltered) {
      $("." + filterTableClass + " .isFiltered").removeClass("isFiltered");
      isFiltered = false;
    }
  }

  function filterProductsMobile(filterString) {
    if (isFiltered) {
      removeProductFilters();
    }
    $(filterString).addClass("isFiltered");
    isFiltered = true;
  }

  function initProdSlider() {
    sageCompareControl.moduleResultsList = $('.filter-module-results-list').slick({
      dots: false,
      infinite: false,
      speed: 300,
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: false,
      responsive: [
        {
          breakpoint: 767,
          settings: {
            focusOnSelect: true,
            centerMode: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 1
          }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ]
    });
  }

  function updateSelectedProducts() {
    var selectedAttributes = [];
    $("." + moduleClass + " ." + filterButtonsClass + "." + activeClass).each(function () {
      selectedAttributes.push($(this).attr("data-filter-attribute"));
    });

    $("." + moduleClass + " ." + productResultsListClass + " ." + productPanelClass).each(function () {
      var productAttributes,
        productAttributesArray,
        productScore = 0;

      productAttributes = $(this).attr("data-filter-attributes");
      productAttributesArray = productAttributes.split("|");

      //loop through selected attributes and add as score to data-score of product-panel
      for (var i = selectedAttributes.length; i--;) {
        var testProd = productAttributesArray.indexOf(selectedAttributes[i]);
        if (testProd >= 0) {
          productScore++;
        }
      }
      $(this).attr('data-score', productScore);
      if (productScore < selectedAttributes.length) {
        $(this).addClass(productPanelDisabledClass);
      } else {
        $(this).removeClass(productPanelDisabledClass);
      }

    });

    $("." + moduleClass).find(".filter-text-no-match,.filter-text-one-match,.filter-text-more-matches").addClass("hidden");

    var numSelected = $("." + moduleClass + " ." + productResultsListClass + " ." + productPanelClass + ":not(." + productPanelDisabledClass + ")").length;

    switch (numSelected) {
      case 0:
        $("." + moduleClass + " .filter-text-no-match").removeClass("hidden");
        break;
      case 1:
        $("." + moduleClass + " .filter-text-one-match").removeClass("hidden");
        break;
      default:
        $("." + moduleClass + " .filter-text-more-matches").removeClass("hidden");
        break;
    }
  }

  return {
    init: init
  }
});