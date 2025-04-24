(function () {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name prcBoqMainDetailFormController
	 * @function
	 *
	 * @description
	 * Controller for the tree grid view of boq items.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.common').controller('prcBoqMainDetailFormController', ['$scope', '$timeout',
		'boqMainDetailFormControllerService',
		'procurementContextService',
		'platformDetailControllerService',
		'prcBoqMainService',
		'boqMainValidationServiceProvider',
		'procurementCommonPrcBoqMainUIStandardService',
		'boqMainTranslationService',
		'boqMainDetailFormConfigService',
		'boqMainCommonService',
		function ($scope, $timeout,
			boqMainDetailFormControllerService,
			moduleContext,
			platformDetailControllerService,
			prcBoqMainService,
			boqMainValidationServiceProvider,
			boqMainStandardConfigurationService,
			boqMainTranslationService,
			boqMainDetailFormConfigService,
			boqMainCommonService) {

			prcBoqMainService = prcBoqMainService.getService(moduleContext.getMainService());

			boqMainDetailFormControllerService.initDetailFormController($scope, $timeout,
				platformDetailControllerService, prcBoqMainService,
				boqMainValidationServiceProvider, boqMainStandardConfigurationService,
				boqMainTranslationService, boqMainDetailFormConfigService, boqMainCommonService);

			function loadUserDefinedColumnDetail() {
				let dynamicUserDefinedColumnsService = prcBoqMainService.getDynamicUserDefinedColumnsService();
				if (dynamicUserDefinedColumnsService && angular.isFunction(dynamicUserDefinedColumnsService.loadUserDefinedColumnDetail)) {
					dynamicUserDefinedColumnsService.loadUserDefinedColumnDetail($scope);
				}
			}

			loadUserDefinedColumnDetail();

			// remove add and delete when module readonly
			if (moduleContext.getModuleReadOnly()) {
				$scope.formContainerOptions.onAddItem = false;
				$scope.formContainerOptions.onDeleteItem = false;
				$scope.formContainerOptions.onAddChildItem = false;
			}

			// register again to set quote BoqItem (position) field 'Quantity' readonly when filed 'FreeQuantity' is false.
			// boqMainDetailFormControllerService.registerSelectionChanged has registered.
			prcBoqMainService.registerSelectionChanged(setQuoteQuantityReadonly);

			function setQuoteQuantityReadonly() {
				if (moduleContext.getModuleName() === 'procurement.quote' && prcBoqMainService.hasSelection()) {
					var boq = prcBoqMainService.getSelected();
					if (boq.BoqLineTypeFk === 0 && !boq.IsFreeQuantity) {// jshint ignore : line
						// platformRuntimeDataService.readonly(boq, [{field: 'Quantity', readonly: true}]);
					}
				}
			}

		}
	]);
})();