(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('businesspartner.evaluationschema').controller('businessPartnerEvaluationSchemaGroupDetailController',
		['$scope', 'platformDetailControllerService', 'businessPartnerEvaluationSchemaGroupService',
			'businessPartnerEvaluationschemaGroupValidationService', 'businessPartnerEvaluationSchemaGroupUIStandardService', 'platformTranslateService',
			function ($scope, platformDetailControllerService, dataService, validationService, uiStandardService, translateService) {
				platformDetailControllerService.initDetailController($scope, dataService, validationService(dataService), uiStandardService, translateService);
			}
		]);
})(angular);