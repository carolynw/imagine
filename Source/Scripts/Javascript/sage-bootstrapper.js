/*jslint jquery: true*/

// This is a hack to get the sageApp to init only once all ng-includes are loaded in
(function () {
  var app = angular.module('sage', []);

  app.run(bootstrapper);

  bootstrapper.$inject = ['$rootScope'];

  function bootstrapper($rootScope) {
    var requested = 0;
    var resolved = 0;
    var timeout;

    $rootScope.$on("$includeContentRequested", function () {
      requested += 1;
      clearTimeout(timeout);
    });

    $rootScope.$on("$includeContentLoaded", handleResolve);
    $rootScope.$on("$includeContentError", handleResolve);

    function handleResolve() {
      resolved += 1;

      if (resolved == requested) {
        timeout = setTimeout(function () {
          console.log('initialising...');
          sageApp.init();
        }, 150);
      }
    }
  }
}());
