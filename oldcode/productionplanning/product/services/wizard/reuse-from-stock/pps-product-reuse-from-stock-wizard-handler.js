/**
 * Created by zwz on 07/04/2022.
 */
(function () {
	'use strict';
	/* global globals, _ */

	const moduleName = 'productionplanning.product';
	angular.module(moduleName).service('productionplanningProductReuseFromStockWizardHandler', Handler);
	Handler.$inject = ['$http', '$q', '$translate', 'platformModalService', 'platformSidebarWizardCommonTasksService'];

	function Handler($http, $q, $translate, platformModalService, platformSidebarWizardCommonTasksService) {

		function validate(product) {
			let deferred = $q.defer();
			// check if belongs to a productionset
			if (_.isNil(product.ProductionSetFk)) {
				let errorMsg = $translate.instant('productionplanning.product.wizard.productionSetOfProductIsNull');
				deferred.resolve({valid: false, error: errorMsg});
			}
			else if (product.HeaderIsForScrap === true) { // check if belongs to scrap ppsHeader, if so, the selected product cannot be produced/replaced from scrap-stock.
				let errorMsg = $translate.instant('productionplanning.product.wizard.productBelongsScrapHeader');
				deferred.resolve({valid: false, error: errorMsg});
			}
			else { // check if already in planning Of Cutting List
				$http.get(globals.webApiBaseUrl + 'productionplanning/product/cuttingproduct/countbyproductid?productId=' + product.Id)
					.then(response => {
						let result = {valid: true};
						if (response && response.data > 0) {
							result.valid = false;
							result.error = $translate.instant('productionplanning.product.wizard.productIsAlreadyInPlanningOfReuseStock');
						}
						deferred.resolve(result);
					});
			}
			return deferred.promise;
		}

		function processOriginalProduct(product) {
			let deferred = $q.defer();
			if (_.isNil(product.ProductionSetFk)) {
				deferred.resolve(product);
			} else {
				$http.post(globals.webApiBaseUrl + 'productionplanning/productionset/productionset/instance', {Id: product.ProductionSetFk})
					.then(response => {
						if (response && response.data) {
							product.SiteFk = response.data.SiteFk;
						}
						deferred.resolve(product);
					});
			}
			return deferred.promise;
		}

		function showDialog(product, wizParam, productDataService) {
			let modalCreateConfig = {
				width: '960px',
				resizeable: true,
				templateUrl: globals.appBaseUrl + 'productionplanning.product/templates/pps-product-reuse-from-stock-wizard-dialog.html',
				controller: 'productionplanningProductReuseFromStockWizardController',
				resolve: {
					$options: function () {
						return {
							originalProduct: product,
							wizParam: wizParam,
							productDataService: productDataService
						};
					}
				}
			};
			platformModalService.showDialog(modalCreateConfig);
		}

		this.reuseProductFromStock = function (productDataService, wizParam) {
			let selectedProduct = productDataService.getSelected();
			// if no selection, show NoSelection error.
			if (!platformSidebarWizardCommonTasksService.assertSelection(selectedProduct)) {
				return;
			}
			validate(selectedProduct).then(result => {
				if (!result.valid) {
					let modalOptions = {
						headerText: $translate.instant('productionplanning.product.wizard.selectReusableProductStepTitle'),
						bodyText: result.error,
						iconClass: 'ico-info'
					};
					platformModalService.showDialog(modalOptions);
				}
				else {
					let originalProduct = _.clone(selectedProduct);
					processOriginalProduct(originalProduct).then(p => {
						showDialog(p, wizParam, productDataService);
					});
				}
			});

		};
	}

})();