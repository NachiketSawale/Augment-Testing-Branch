( function (angular) {
	'use strict';
	var moduleName = 'basics.procurementstructure';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsProcurementClerkDetailController',
		['$scope', 'basicsProcurementClerkUIStandardService', 'basicsProcurement2ClerkService',
			'platformDetailControllerService', 'platformTranslateService', 'basicsProcurementStructure2ClerkValidationService',
			function ($scope, formConfiguration, dataService, detailControllerService, translateService,validationService) {
				detailControllerService.initDetailController( $scope, dataService, validationService, formConfiguration, translateService );
			}]);
})(angular);
