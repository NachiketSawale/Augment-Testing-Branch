
(function () {
    /* global globals */
    'use strict';
    let moduleName = 'controlling.configuration';

    angular.module(moduleName).controller('controllingConfigurationFormulaImageController',
        ['$scope', '$translate','contrConfigFormulaImageService','controllingConfigurationFormulaDefinitionDataService',
            function ($scope, $translate,contrConfigFormulaImageService, formulaDefDataService) {

                $scope.formulaImageSvg = $translate.instant('controlling.configuration.formulaImageHandling');

                contrConfigFormulaImageService.setScope($scope);

                $scope.tools = {
                    items:[]
                };

                $scope.tools.update = function (){};

                contrConfigFormulaImageService.changeFormulaContent(formulaDefDataService.getSelected());

                $scope.$on('$destroy', function () {

                });
            }]);
})();
