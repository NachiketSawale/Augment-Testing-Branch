/**
 * Created by wuj on 1/16/2015.
 */
(function (angular) {
	'use strict';
	/* jshint -W072 */

	angular.module('basics.materialcatalog').controller('basicsMaterialCatalogMaterialGroupDetailController',
		['$scope', 'basicsMaterialCatalogGroupUIStandardService', 'basicsMaterialCatalogMaterialGroupService', 'platformDetailControllerService',
			'platformTranslateService', 'basicsMaterialCatalogMaterialGroupValidationService',
			function ($scope, formConfiguration, dataService, detailControllerService, translateService, validationService) {

				detailControllerService.initDetailController($scope, dataService, validationService, formConfiguration, translateService);

			}]);

})(angular);