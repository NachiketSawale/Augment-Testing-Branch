/**
 * Created by alm on 1/20/2021.
 */
(function (angular) {

	'use strict';

	var moduleName = 'hsqe.checklisttemplate';
	angular.module(moduleName).controller('hsqeCheckListTemplate2FormDetailController',
		['$scope', 'platformDetailControllerService', 'hsqeCheckListTemplate2FormService', 'hsqeCheckListTemplate2FormUIStandardService','hsqeCheckListTemplate2FromValidationService',
			'platformTranslateService',
			function ($scope, platformDetailControllerService, dataService, uiService,validationService, platformTranslateService) {
				platformDetailControllerService.initDetailController($scope, dataService, validationService, uiService, platformTranslateService);
			}]);
})(angular);
