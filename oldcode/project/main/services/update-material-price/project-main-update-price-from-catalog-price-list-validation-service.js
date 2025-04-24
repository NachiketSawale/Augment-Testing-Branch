/**
 * Created by chi on 1/8/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'project.main';
	angular.module(moduleName).factory('projectMainUpdatePriceFromCatalogPriceListValidationService', projectMainUpdatePriceFromCatalogPriceListValidationService);

	projectMainUpdatePriceFromCatalogPriceListValidationService.$inject = [
		'$injector',
		'_',
		'$timeout',
		'$translate',
		'projectMainUpdatePriceFromCatalogMainService'
	];

	function projectMainUpdatePriceFromCatalogPriceListValidationService(
		$injector,
		_,
		$timeout,
		$translate,
		projectMainUpdatePriceFromCatalogMainService
	) {
		var service = {};

		service.validateSelected = validateSelected;
		service.validateWeighting = validateWeighting;

		return service;

		/////////////////////////////
		function validateSelected() {
			$timeout(function () {
				var dataService = $injector.get('projectMainUpdatePriceFromCatalogPriceListService');
				dataService.changeSourceOption();
				var selectedInfo = dataService.collectSourceInfo();
				projectMainUpdatePriceFromCatalogMainService.priceListSelectionChanged.fire(null, selectedInfo);
			});
			return true;
		}

		function validateWeighting(entity, value) {
			var result = {valid: true, apply: true};
			var dataService = $injector.get('projectMainUpdatePriceFromCatalogPriceListService');
			if (!value || value < 0) {
				result = {
					apply: true,
					valid: false,
					error: $translate.instant('project.main.updatePriceFromCatalogWizard.weightingGreaterThanZeroError')
				};
			}
			$timeout(function () {
				if (entity.Selected && result.valid) {
					dataService.changeSourceOption();
					var selectedInfo = dataService.collectSourceInfo();
					projectMainUpdatePriceFromCatalogMainService.priceListSelectionChanged.fire(null, selectedInfo);
				}
			});
			return result;
		}
	}
})(angular);
