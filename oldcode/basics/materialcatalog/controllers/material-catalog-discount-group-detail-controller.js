/**
 * Created by wuj on 1/16/2015.
 */
/* jshint -W072 */
(function (angular) {
	'use strict';
	angular.module('basics.materialcatalog').controller('basicsMaterialCatalogDiscountGroupDetailController',
		['$scope', 'basicsMaterialCatalogDiscountGroupUIStandardService', 'basicsMaterialCatalogDiscountGroupService', 'platformDetailControllerService',
			'platformTranslateService', 'basicsMaterialCatalogDiscountGroupValidationService',
			function ($scope, formConfiguration, dataService, detailControllerService, translateService, validationService) {

				detailControllerService.initDetailController($scope, dataService, validationService, formConfiguration, translateService);

			}]);
})(angular);