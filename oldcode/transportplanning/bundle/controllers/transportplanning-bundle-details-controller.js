(function (angular) {
    'use strict';

    var moduleName = 'transportplanning.bundle';

    angular.module(moduleName).controller('transportplanningBundleDetailsController', BundleDetailsController);
    BundleDetailsController.$inject = ['$scope', 'platformContainerControllerService'];

    function BundleDetailsController($scope, platformContainerControllerService) {
        platformContainerControllerService.initController($scope, moduleName, '1145ec1dabcd41b79568c44afdb0f3e0');
    }
})(angular);