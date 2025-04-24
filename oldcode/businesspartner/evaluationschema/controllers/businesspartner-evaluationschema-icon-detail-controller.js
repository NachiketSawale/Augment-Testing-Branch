(function (angular) {
	'use strict';
	angular.module('businesspartner.evaluationschema').controller('businesspartnerEvaluationschemaIconDetailController', ['$scope', 'platformDetailControllerService', 'platformTranslateService', 'businesspartnerEvaluationschemaIconService', 'businessPartnerEvaluationschemaIconUIStandardService', 'businesspartnerEvaluationschemaIconValidationService',
		/* jshint -W072 */ // many parameters because of dependency injection
		function ($scope, myInitService, translateService, dataService, uIStandardService, validationService) {
			myInitService.initDetailController($scope, dataService, validationService(dataService), uIStandardService, translateService);
		}]);
})(angular);