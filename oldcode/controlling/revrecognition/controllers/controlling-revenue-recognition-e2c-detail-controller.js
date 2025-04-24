
(function (angular) {

	'use strict';

	var moduleName = 'controlling.revrecognition';
	angular.module(moduleName).controller('controllingRevenueRecognitionE2cDetailController',
		['$scope', 'platformDetailControllerService', 'controllingRevenueRecognitionE2cItemService','controllingRevenueRecognitionItemE2cValidationService', 'controllingRevenueRecognitionE2cUIStandardService',
			'platformTranslateService',
			function ($scope, platformDetailControllerService, dataService, validateService, uiService,platformTranslateService) {
				platformDetailControllerService.initDetailController($scope, dataService, validateService, uiService, platformTranslateService);
			}]);
})(angular);
