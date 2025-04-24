(function () {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('businesspartner.evaluationschema').controller('businessPartnerEvaluationSchemaGroupController',
		['$scope', 'businessPartnerEvaluationSchemaGroupService', 'businessPartnerEvaluationSchemaGroupUIStandardService',
			'businessPartnerEvaluationschemaGroupValidationService', 'platformGridControllerService',
			function ($scope, dataService, uiStandardService, validationService, platformGridControllerService) {
				platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService(dataService), {});
			}
		]);
})();