(function (angular) {
	'use strict';
	angular.module('businesspartner.evaluationschema').controller('businesspartnerEvaluationschemaHeaderController', ['$scope', 'platformGridControllerService', 'businesspartnerEvaluationschemaHeaderService', 'businessPartnerEvaluationschemaHeaderUIStandardService', 'businesspartnerEvaluationschemaHeaderValidationService',
		/* jshint -W072 */ // many parameters because of dependency injection
		function ($scope, platformGridControllerService, dataService, uIStandardService, validationService) {
			platformGridControllerService.initListController($scope, uIStandardService, dataService, validationService(dataService), {});

			// small module should load data when user enter the module
			// dataService.refresh();
		}]);
})(angular);