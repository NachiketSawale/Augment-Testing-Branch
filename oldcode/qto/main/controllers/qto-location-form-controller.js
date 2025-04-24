(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('qto.main').controller('qtoMainLocationDetailFormController',
		['$scope', 'qtoMainLocationUIStandardService', 'qtoMainLocationDataService', 'platformDetailControllerService',
			'platformTranslateService', 'qtoLocationValidationService',
			function ($scope, formConfiguration, dataService, detailControllerService, translateService, validationService) {
				detailControllerService.initDetailController($scope, dataService, validationService, formConfiguration, translateService);
			}]);
})(angular);

