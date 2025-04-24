/**
 * Created by alm on 8/24/2020.
 */
(function (angular) {

	'use strict';

	var moduleName = 'basics.taxcode';
	angular.module(moduleName).controller('basicsTaxCodeDetailController',
		['$scope', 'platformDetailControllerService', 'basicsTaxCodeMainService', 'basicsTaxCodeValidationService', 'basicsTaxCodeUIStandardService',
			'platformTranslateService',
			function ($scope, platformDetailControllerService, dataService, validationService, uiService, platformTranslateService) {
				platformDetailControllerService.initDetailController($scope, dataService, validationService, uiService, platformTranslateService);
			}]);
})(angular);
