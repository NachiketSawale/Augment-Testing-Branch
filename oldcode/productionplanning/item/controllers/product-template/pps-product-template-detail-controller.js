/**
 * Created by anl on 8/12/2022.
 */
(function (angular) {
	'use strict';
	/* global _ */
	const moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('productionplanningItemProductTemplateDetailController', ProductTemplateDetailController);

	ProductTemplateDetailController.$inject = ['$scope', 'productionplanningItemProductTemplateService',
		'productionplanningProducttemplateProductDescriptionUIStandardService',
		'productionplanningProducttemplateTranslationService',
		'platformDetailControllerService',
		'productionplanningProducttemplateProductDescriptionValidationServiceFactory',];

	function ProductTemplateDetailController($scope, productTemplateService,
		uiStandardService,
		translationService,
		platformDetailControllerService,
		validationServiceFactory) {

		const formConfig = uiStandardService.getStandardConfigForDetailView();
		const originalChange = formConfig.change;
		formConfig.change = function(entity, field, column) {
			if (_.isFunction(originalChange)) {
				originalChange(entity, field, column);
			} else if (_.isString(originalChange)) {
				$scope[originalChange](entity, field, column);
			}

			productTemplateService.handleFieldChanged(entity, field);
		};

		const validationService = validationServiceFactory.getService(productTemplateService);

		platformDetailControllerService.initDetailController($scope, productTemplateService, validationService, uiStandardService, translationService);

		$scope.$on('$destroy', function () {});
	}
})(angular);