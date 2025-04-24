/**
 * Created by lcn on 11/4/2021.
 */
(function (angular) {

	'use strict';

	var moduleName = 'basics.salestaxcode';
	angular.module(moduleName).controller('basicsSalesTaxMatrixDetailController',
		['$scope', 'platformDetailControllerService', 'basicsSalesTaxMatrixService', 'basicsSalesTaxMatrixUIStandardService', 'basicsSalesTaxMatrixValidationService',
			'platformTranslateService',
			function ($scope, platformDetailControllerService, dataService, uiService, validationService, platformTranslateService) {
				platformDetailControllerService.initDetailController($scope, dataService, validationService, uiService, platformTranslateService);
			}]);
})(angular);
