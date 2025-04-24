
(function (angular) {

	'use strict';

	var moduleName = 'controlling.revrecognition';
	angular.module(moduleName).controller('controllingRevenueRecognitionDocumentDetailController',
		['$scope', 'platformDetailControllerService', 'controllingRevenueRecognitionDocumentDataService', 'controllingRevenueRecognitionDocumentUIStandardService',
			'platformTranslateService',
			function ($scope, platformDetailControllerService, dataService, uiService,platformTranslateService) {
				platformDetailControllerService.initDetailController($scope, dataService, {}, uiService, platformTranslateService);
			}]);
})(angular);
