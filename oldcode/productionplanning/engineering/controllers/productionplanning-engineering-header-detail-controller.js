
(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.engineering';
    var angModule = angular.module(moduleName);

    angModule.controller('productionplanningEngineeringHeaderDetailController', productionplanningEngineeringHeaderDetailController);
    productionplanningEngineeringHeaderDetailController.$inject = ['$scope', 'platformDetailControllerService',
		'productionplanningEngineeringHeaderDataService',
		'productionplanningEngineeringHeaderValidationService',
        'productionplanningEngineeringHeaderUIStandardService',
		'productionplanningEngineeringTranslationService'];

    function productionplanningEngineeringHeaderDetailController($scope, platformDetailControllerService,
													  dataServ, 
													  validServ,
													  confServ, 
													  translationServ ) {

        platformDetailControllerService.initDetailController($scope, dataServ, validServ, confServ, translationServ);
    }

})(angular);