/**
 * Created by zwz on 07/01/2022.
 */

(function (angular) {
	'use strict';
	/* global globals, _ */
	var moduleName = 'productionplanning.product';

	angular.module(moduleName).factory('productionplanningProductReuseFromStockWizardService', WizardService);
	WizardService.$inject = ['$http', '$translate', 'productionplanningProductReuseFromStockWizardStepsService', 'productionplanningProductCuttingProductDataService'];

	function WizardService($http, $translate, wizardStepsService, cuttingProductDataService) {
		let service = {};
		service.initial = function initial(scope, options) {
			scope.title = $translate.instant('productionplanning.product.wizard.reuseFromStockTitle');
			scope.isBusy = false;
			scope.context = {
				originalProduct: options.originalProduct,
				// producedFromScrapProductStatusId: options.wizParam['producedFromScrapProductStatusId'] // useless param ProducedFromScrapProductStatusId, maybe it will be enable in the future
			};
			scope.steps = [
				{
					url: 'productionplanning.product/partials/pps-product-reuse-from-stock-wizard-selection.html',
					service: 'productionplanningProductReuseFromStockWizardSelectionService',
					title: $translate.instant('productionplanning.product.wizard.selectReusableProductStepTitle'),
					isInitialized: true
				},
				{
					url: 'productionplanning.product/partials/pps-product-reuse-from-stock-wizard-rem-setting.html',
					service: 'productionplanningProductReuseFromStockWizardRemainderSettingService',
					title: $translate.instant('productionplanning.product.wizard.remainderSettingStepTitle')
				}
			];

			wizardStepsService.initialize(scope, finish);

			scope.$on('$destroy', function () {
			});

			_.extend(scope.modalOptions, {
				cancel: close
			});

			function close() {
				return scope.$close(false);
			}

			function finish(settingService) {
				let settingResult = settingService.getResult();
				let request = {
					OriginalProduct: scope.context.originalProduct,
					// ProducedFromScrapProductStatusId: scope.context.producedFromScrapProductStatusId, // useless param ProducedFromScrapProductStatusId, maybe it will be enable in the future
					ReplacementProduct: scope.context.selectedReusableProduct,
					ScrapRemainingLength: settingResult.scrapRemainingLength,
					ScrapRemainingWidth: settingResult.scrapRemainingWidth
				};
				$http.post(globals.webApiBaseUrl + 'productionplanning/product/stock/reusableproduct/update', request)
					.then(response => {
						if (response) {
							if (options.productDataService.isRoot) {
								// productDataService is a root service
								options.productDataService.refreshSelectedEntities();
							} else {
								// productDataService is a child service
								options.productDataService.load();
							}
							cuttingProductDataService.refresh();
						}
					});

				scope.$close(false);
			}

		};

		return service;
	}

})(angular);
