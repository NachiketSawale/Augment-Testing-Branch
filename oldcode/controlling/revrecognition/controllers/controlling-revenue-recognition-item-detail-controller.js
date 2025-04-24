
(function (angular) {

	'use strict';

	var moduleName = 'controlling.revrecognition';
	angular.module(moduleName).controller('controllingRevenueRecognitionItemDetialController',
		['$scope', 'platformDetailControllerService', 'controllingRevenueRecognitionItemService','controllingRevenueRecognitionItemValidationService', 'controllingRevenueRecognition2ItemUIStandardService',
			'platformTranslateService',
			function ($scope, platformDetailControllerService, dataService, validateService, uiService,platformTranslateService) {
				platformDetailControllerService.initDetailController($scope, dataService, validateService, uiService, platformTranslateService);
			}]);
})(angular);
