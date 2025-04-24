/**
 * Created by alm on 1/25/2021.
 */
(function (angular) {

	'use strict';

	var moduleName = 'hsqe.checklist';
	angular.module(moduleName).controller('hsqeCheckListLocationDetailController',
		['$scope', 'platformDetailControllerService', 'hsqeCheckListLocationDataService', 'hsqeCheckListLocationUIStandardService','hsqeCheckListLocationValidationService',
			'platformTranslateService',
			function ($scope, platformDetailControllerService, dataService, uiService, validationService,platformTranslateService) {
				platformDetailControllerService.initDetailController($scope, dataService, validationService, uiService, platformTranslateService);
			}]);
})(angular);
