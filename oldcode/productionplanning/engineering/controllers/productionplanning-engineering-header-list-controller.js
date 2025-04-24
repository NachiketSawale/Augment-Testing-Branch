
(function (angular) {

    'use strict';

    var moduleName = 'productionplanning.engineering';
    var angModule = angular.module(moduleName);

    angModule.controller('productionplanningEngineeringHeaderListController', productionplanningEngineeringHeaderListController);

    productionplanningEngineeringHeaderListController.$inject = ['$scope', 'platformGridControllerService',
	'productionplanningEngineeringHeaderDataService',
	'productionplanningEngineeringHeaderUIStandardService', 
	'productionplanningEngineeringHeaderValidationService'];

    function productionplanningEngineeringHeaderListController($scope, platformGridControllerService, 
													dataService, 
													uiStandardService, 
													validationService) {

        var gridConfig = {
            initCalled: false,
            pinningContext: true, //set to refresh tools when pinningContext changed
			columns: []
        };

        platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);
	}
})(angular);
		