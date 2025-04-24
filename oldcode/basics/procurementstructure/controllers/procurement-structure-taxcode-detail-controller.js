( function (angular) {
	'use strict';
	var moduleName = 'basics.procurementstructure';

	angular.module(moduleName).controller('basicsProcurementTaxCodeDetailController',
		['$scope', 'basicsProcurementStructureTaxCodeUIStandardService', 'basicsProcurementStructureTaxCodeService',
			'platformDetailControllerService', 'platformTranslateService', 'basicsProcurementStructureTaxCodeValidationService',
			function ($scope, formConfiguration, dataService, detailControllerService, translateService, validationService) {
				detailControllerService.initDetailController($scope, dataService, validationService, formConfiguration, translateService);
			}]);
})(angular);
