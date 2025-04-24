/**
 * Created by wuj on 1/16/2015.
 */

(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module('basics.materialcatalog').controller('basicsMaterialCatalogGroupCharDetailController',
		['$scope', 'basicsMaterialCatalogGroupCharUIStandardService', 'basicsMaterialCatalogGroupCharService', 'platformDetailControllerService',
			'platformTranslateService', 'basicsMaterialCatalogGroupCharValidationService',
			function ($scope, formConfiguration, dataService, detailControllerService, translateService, validationService) {
				detailControllerService.initDetailController($scope, dataService, validationService, formConfiguration, translateService);
			}]);
})(angular);
