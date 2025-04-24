(function (angular) {
	'use strict';
	let moduleName = 'businesspartner.contact';

	angular.module(moduleName).controller('businesspartnerContact2BpAssignmentFormController', [
		'$scope', 'platformDetailControllerService', 'businesspartnerContact2BpAssignmentDataService',
		'businessPartnerContact2BpAssignmentValidationService', 'businessPartnerContact2BpAssignmentUIStandardService', 'platformTranslateService',

		function ($scope, platformDetailControllerService, dataService, validationService, UIStandardService, platformTranslateService) {
			platformDetailControllerService.initDetailController($scope, dataService, validationService, UIStandardService, UIStandardService, platformTranslateService);
		}]);
})(angular);