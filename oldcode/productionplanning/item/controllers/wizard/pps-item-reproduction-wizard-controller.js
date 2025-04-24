/**
 * Created by las on 10/9/2019.
 */

(function (angular) {
    'use strict';
    /*global angular*/
    var moduleName = 'productionplanning.item';

    angular.module(moduleName).controller('productionplanningItemReproductionWizardController', controller);
    controller.$inject = ['$scope', '$options', 'productionplanningItemReproductionWizardService', 'platformGridAPI'];

    function controller($scope, $options, reproductionWizardService, platformGridAPI) {
        reproductionWizardService.initial($scope, $options);

        $scope.$on('$destroy', function () {
          //  reproductionWizardService.destroy();
        });

        setTimeout(function () {
            platformGridAPI.grids.resize($scope.grid.state);
        }, 200);
}

})(angular);