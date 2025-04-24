/**
 * Created by alm on 8/25/2020.
 */
(function (angular) {

	'use strict';

	var moduleName = 'basics.taxcode';
	angular.module(moduleName).controller('basicsTaxCodeMatrixDetailController',
		['$scope', 'platformDetailControllerService', 'basicsTaxCodeMatrixService', 'basicsTaxCodeMatrixUIStandardService', 'basicsTaxCodeMatrixValidationService',
			'platformTranslateService',
			function ($scope, platformDetailControllerService, dataService, uiService, validationService, platformTranslateService) {
				platformDetailControllerService.initDetailController($scope, dataService, validationService, uiService, platformTranslateService);
			}]);
})(angular);
