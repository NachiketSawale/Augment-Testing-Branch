(function () {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('businesspartner.evaluationschema').controller('businessPartnerEvaluationSchemaItemController',
		['$scope', 'businessPartnerEvaluationSchemaItemService', 'businessPartnerEvaluationSchemaItemUIStandardService',
			'businessPartnerEvaluationschemaItemValidationService', 'platformGridControllerService',
			function ($scope, dataService, uiStandardService, validationService, platformGridControllerService) {

				platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService(dataService), {});

				dataService.parentService().multiSelectValueChangeEvent.register(dataService.multiSelectValueChangeHandler);

				$scope.$on('$destroy', function () {
					dataService.parentService().multiSelectValueChangeEvent.unregister(dataService.multiSelectValueChangeHandler);
				});
			}
		]);
})();