(function (angular) {
	'use strict';
	angular.module('businesspartner.evaluationschema').controller('businesspartnerEvaluationschemaIconController', ['$scope', 'platformGridControllerService', 'businesspartnerEvaluationschemaIconService', 'businessPartnerEvaluationschemaIconUIStandardService', 'businesspartnerEvaluationschemaIconValidationService',
		/* jshint -W072 */ // many parameters because of dependency injection
		function ($scope, platformGridControllerService, dataService, uIStandardService, validationService) {
			platformGridControllerService.initListController($scope, uIStandardService, dataService, validationService(dataService), {});
		}]);
})(angular);