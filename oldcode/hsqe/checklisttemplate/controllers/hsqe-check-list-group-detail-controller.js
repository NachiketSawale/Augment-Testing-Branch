/**
 * Created by alm on 1/20/2021.
 */
(function (angular) {
	'use strict';
	var moduleName = 'hsqe.checklisttemplate';
	angular.module(moduleName).controller('hsqeCheckListGroupDetailController', ['$scope', 'platformDetailControllerService', 'hsqeCheckListGroupService', 'hsqeCheckListGroupValidationService', 'hsqeCheckListGroupUIStandardService', 'platformTranslateService',
		function ($scope, platformDetailControllerService, dataService, validationService, uiService, platformTranslateService) {
			platformDetailControllerService.initDetailController($scope, dataService, validationService, uiService, platformTranslateService);
		}]);
})(angular);
