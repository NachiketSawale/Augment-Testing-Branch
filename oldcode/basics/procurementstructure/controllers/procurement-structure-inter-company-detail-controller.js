( function (angular) {
	'use strict';
	var moduleName = 'basics.procurementstructure';

	angular.module(moduleName).controller('basicsProcurementStructureInterCompanyDetailController',
		['$scope', 'procurementStructureInterCompanyUIStandardService', 'basicsProcurementInterCompanyDataService',
			'platformDetailControllerService', 'platformTranslateService', 'procurementStructureInterCompanyValidationService',
			function ($scope, formConfiguration, dataService, detailControllerService, translateService, validationService) {
				detailControllerService.initDetailController($scope, dataService, validationService, formConfiguration, translateService);
			}]);
})(angular);
