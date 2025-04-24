

/**
 * Created by wuj on 8/19/2015.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.package';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementPackagePackage2HeaderFormController',
		['$scope','platformDetailControllerService', 'procurementPackagePackage2HeaderService', 'procurementPackagePackage2HeaderValidationService', 'procurementPackagePackage2HeaderUIStandardService','platformTranslateService',
			function ($scope,platformDetailControllerService, dataService, validationService, uiService,platformTranslateService) {
				platformDetailControllerService.initDetailController($scope, dataService, validationService, uiService, platformTranslateService);
			}]);

})(angular);