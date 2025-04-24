/**
 * Created by alm on 1/20/2021.
 */
(function (angular) {

	'use strict';

	var moduleName = 'hsqe.checklisttemplate';
	angular.module(moduleName).controller('hsqeCheckListTemplateHeaderDetailController',
		['$scope', 'platformDetailControllerService', 'hsqeCheckListTemplateHeaderService', 'hsqeCheckListTemplateUIStandardService','hsqeCheckListTemplateValidationService',
			'platformTranslateService',
			function ($scope, platformDetailControllerService, dataService, uiService,validationService, platformTranslateService) {
				platformDetailControllerService.initDetailController($scope, dataService,validationService, uiService, platformTranslateService);
			}]);
})(angular);
