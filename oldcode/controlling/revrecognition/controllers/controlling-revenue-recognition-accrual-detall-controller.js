
(function (angular) {

	'use strict';

	var moduleName = 'controlling.revrecognition';
	angular.module(moduleName).controller('controllingRevenueRecognitionAccrualDetailController',
		['$scope', 'platformDetailControllerService', 'controllingRevenueRecognitionAccrualService', 'controllingRevenueRecognitionAccrualUIStandardService',
			'platformTranslateService',
			function ($scope, platformDetailControllerService, dataService, uiService,platformTranslateService) {
				platformDetailControllerService.initDetailController($scope, dataService, {}, uiService, platformTranslateService);
			}]);
})(angular);
