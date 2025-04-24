(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module('basics.materialcatalog').controller('basicsMaterialCatalogDetailController',
		['$scope', 'basicsMaterialCatalogUIStandardService', 'basicsMaterialCatalogService', 'platformDetailControllerService',
			'platformTranslateService', 'basicsMaterialCatalogValidationService',
			function ($scope, formConfiguration, dataService, detailControllerService, translateService, validationService) {
				detailControllerService.initDetailController($scope, dataService, validationService, formConfiguration, translateService);
			}]);
})(angular);