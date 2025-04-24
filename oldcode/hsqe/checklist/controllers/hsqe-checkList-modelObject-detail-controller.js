/**
 * Created by yew on 2/04/2021.
 */
(function (angular) {

	'use strict';

	var moduleName = 'hsqe.checklist';
	angular.module(moduleName).controller('checkListModelObjectDetailController',
		['$scope', 'platformDetailControllerService', 'hsqeCheckListModelObjectDataService', 'hsqeCheckListModelObjectUIStandardService', 'hsqeCheckListModelObjectValidationService', 
			'platformTranslateService',
			function ($scope, platformDetailControllerService, dataService, uiService, validationService,  platformTranslateService) {
				platformDetailControllerService.initDetailController($scope, dataService, validationService, uiService, platformTranslateService);
			}]);
})(angular);
