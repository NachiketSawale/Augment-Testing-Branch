(function (angular) {

	'use strict';

	var moduleName = 'basics.site';
	angular.module(moduleName).controller('basicsSite2StockListController', Site2StockListController);

	Site2StockListController.$inject = ['$scope', '$injector', 'platformGridControllerService',
		'basicsSite2StockDataService', 'basicsSite2StockUIStandardService', 'basicsSite2StockValidationService'];

	function Site2StockListController($scope, $injector, gridControllerService,
	                                  dataService, uiStandardService, validationService) {
		var gridConfig = {};

		gridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);
	}
})(angular);
