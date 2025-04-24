
(function (angular) {
	'use strict';
	var moduleName = 'hsqe.checklist';
	angular.module(moduleName).controller('hsqeCheckListDetailController',
		['$scope', 'platformDetailControllerService', 'hsqeCheckListDataService', 'hsqeCheckListUIStandardService', 'platformTranslateService','hsqeCheckListValidationService',
			function ($scope, platformDetailControllerService, dataService, formConfig, translateService, validationService) {

				platformDetailControllerService.initDetailController($scope, dataService, validationService, formConfig, translateService);
			}
		]);

})(angular);