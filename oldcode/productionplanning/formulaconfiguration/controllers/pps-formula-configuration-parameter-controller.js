/**
 * Created by anl on 5/5/2022.
 */
(function (angular) {
	'use strict';

	var module = 'productionplanning.formulaconfiguration';

	angular.module(module).controller('productionplanningFormulaConfigurationParameterListController', ParameterListController);

	ParameterListController.$inject = [
		'$scope', '$translate',
		'basicsCommonToolbarExtensionService',
		'platformGridControllerService',
		'productionplanningFormulaConfigurationParameterUIStandardService',
		'productionplanningFormulaConfigurationParameterDataServiceFactory',
		'productionplanningFormulaConfigurationParameterValidationServiceFactory'];

	function ParameterListController($scope, $translate,
		basicsCommonToolbarExtensionService,
		platformGridControllerService,
		uiStandardService,
		dataServiceFactory,
		validationService) {

		var gridConfig = {initCalled: false, columns: []};

		var serviceOptions = $scope.getContentValue('serviceOptions');

		var dataService = dataServiceFactory.getOrCreateService(serviceOptions);

		platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService.getService({'dataService': dataService}), gridConfig);

		basicsCommonToolbarExtensionService.insertBefore($scope, {
			id: 'recalculation',
			caption: $translate.instant('productionplanning.formulaconfiguration.ppsParameter.recalculation'),
			type: 'item',
			iconClass: 'tlb-icons ico-calculate-measurement',
			fn: () => {
				dataService.recalculate();
			},
			disabled: () => {
				return !dataService.canRecalculate();
			}
		});
	}
})(angular);