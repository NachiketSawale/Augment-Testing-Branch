
(function (angular) {

	'use strict';
	
	var moduleName = 'hsqe.checklist';
	angular.module(moduleName).controller('hsqeCheckListDocumentDetailController',
		['$scope', 'platformDetailControllerService', 'hsqeCheckListDocumentDataService', 'hsqeCheckListDocumentUIStandardService','hsqeCheckListDocumentValidationService',
			'platformTranslateService',
			function ($scope, platformDetailControllerService, dataService, uiService, validationService,platformTranslateService) {
				platformDetailControllerService.initDetailController($scope, dataService, validationService, uiService, platformTranslateService);
			}]);
})(angular);
