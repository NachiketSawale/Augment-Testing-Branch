(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('businesspartner.evaluationschema').controller('businessPartnerEvaluationSchemaItemDetailController',
		['$scope', 'platformDetailControllerService', 'businessPartnerEvaluationSchemaItemService', 'businessPartnerEvaluationschemaItemValidationService',
			'businessPartnerEvaluationSchemaItemUIStandardService', 'platformTranslateService',
			function ($scope, platformDetailControllerService, dataService, validationService, uiStandardService, translateService) {
				platformDetailControllerService.initDetailController($scope, dataService, validationService(dataService), uiStandardService, translateService);

				dataService.parentService().multiSelectValueChangeEvent.register(dataService.multiSelectValueChangeHandler);

				$scope.$on('$destroy', function () {
					dataService.parentService().multiSelectValueChangeEvent.unregister(dataService.multiSelectValueChangeHandler);
				});
			}
		]);
})(angular);