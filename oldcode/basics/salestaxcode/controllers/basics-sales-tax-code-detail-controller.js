/**
 * Created by lcn on 11/4/2021.
 */
(function (angular) {

	'use strict';

	var moduleName = 'basics.salestaxcode';
	angular.module(moduleName).controller('basicsSalesTaxCodeDetailController',
		['$scope', 'platformDetailControllerService', 'basicsSalesTaxCodeMainService', 'basicsSalesTaxCodeValidationService', 'basicsSalesTaxCodeUIStandardService',
			'platformTranslateService',
			function ($scope, platformDetailControllerService, dataService, validationService, uiService, platformTranslateService) {
				platformDetailControllerService.initDetailController($scope, dataService, validationService, uiService, platformTranslateService);
			}]);
})(angular);
