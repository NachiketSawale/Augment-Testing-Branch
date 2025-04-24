/**
 * Created by yew on 1/26/2021.
 */
(function (angular) {

	'use strict';

	var moduleName = 'hsqe.checklist';
	angular.module(moduleName).controller('hsqeCheckListFormDetailController',
		['$scope', 'platformDetailControllerService', 'hsqeCheckListFormDataService', 'hsqeCheckListFormUIStandardService',
			'platformTranslateService', 'hsqeCheckListFormValidationService',
			function ($scope, platformDetailControllerService, dataService, uiService, platformTranslateService, validationService) {
				platformDetailControllerService.initDetailController($scope, dataService, validationService, uiService, platformTranslateService);
			}]);
})(angular);
