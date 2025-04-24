/**
 * Created by zwz on 12/27/2024.
 */
// remark: implementation of ppsBillingDataOfProductAndMaterialSelectionWizardDialogTabProductService is based on copy from transportplanningTransportCreateTransportRouteDialogProductService
(angular => {
	'use strict';
	/* global globals, _ */
	const moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('ppsBillingDataOfProductAndMaterialSelectionWizardDialogTabProductService', Service);

	Service.$inject = [
		'platformModalService', 'PlatformMessenger', 'platformGridAPI',
		'packageTypes', 'ppsBillingDataOfProductAndMaterialSelectionWizardDialogTabServiceFactory'
	];

	function Service(
		platformModalService, PlatformMessenger, platformGridAPI,
		packageTypes, tabServiceFactory
	) {

		const dialogGridId = 'a70af18b20884ed19c3b4f15a5c58b88';
		const serviceOption = {
			pkgType: packageTypes.Product,
			resultName: 'Products',
		};
		const service = tabServiceFactory.createInstance(serviceOption);

		// remark: parameter entity is passed from tab service
		service.createItem = function (entity) {
			const checkedProducts = new Map();
			service.getList().forEach(item => {
				checkedProducts.set(item.Id, item);
			});
			const existedSelectedProducts = service.getList();
			const preselectedProducts = entity.preselectedProducts?.length > 0
				? entity.preselectedProducts.filter(x => !existedSelectedProducts.some(e => e.Id === x.Id))
				: [];

			const dialogConfig = {
				width: '60%',
				resizeable: true,
				templateUrl: globals.appBaseUrl + 'basics.lookupdata/partials/lookup-filter-dialog-form-grid.html',
				controller: 'ppsBillingDataOfProductAndMaterialSelectionWizardDialogTabProductLookupDialogController',
				resolve: {
					'$options': getDialogOptions
				},
			};
			platformModalService.showDialog(dialogConfig);

			function getDialogOptions() {
				function extendFilter (paramsObj){
					paramsObj.ignoredIds = service.getList().length > 0 ? service.getList().map(e => e.Id) : [];
				}
				return {
					// isCheckedValueChange: isCheckedValueChange,
					extendFilter: extendFilter,
					doBeforeInit: function (lookupOptions) {
						// set default filters
						const originalDefaultFilterFn = lookupOptions.defaultFilter;
						lookupOptions.defaultFilter = function (request) {
							originalDefaultFilterFn(request);
							request.projectId = entity.projectId;
							request.ordHeaderId = entity.ordHeaderId;
							request.ppsHeaderId = entity.ppsHeaderId;
							request.jobIds = Array.from(new Set(entity.jobIds));
							request.ppsItemIds = entity.ppsItemIds;
							request.statusIds = entity?.statusIds?.map(e => e.toString());
							request.materialIds = entity.materialIds;
							request.drawingIds = entity.drawingIds;
							extendFilter(request);

							return request;
						};

						// lookupOptions.processData = function (data) {
						// 	data.forEach(item => item.Checked = checkedProducts.has(item.Id));
						// 	return data;
						// };
					},
					doAfterInit: function (scope) {
						scope.canSelect = null;
						scope.onSelectedItemsChanged = new PlatformMessenger();

						scope.options.selectableCallback = function () {
							return checkedProducts.size > 0;
						};

						// events
						scope.onSelectedItemsChanged.register(applySelection);
						// platformGridAPI.events.register(dialogGridId, 'onCellChange', checkItem);
						platformGridAPI.events.register(dialogGridId, 'onRowsChanged', updateOkButtonState);

						function applySelection() {
							service.createReferences([...checkedProducts.values()]);
							// unregister events
							scope.onSelectedItemsChanged.unregister(applySelection);
							// platformGridAPI.events.unregister(dialogGridId, 'onCellChange', checkItem);
							platformGridAPI.events.unregister(dialogGridId, 'onRowsChanged', updateOkButtonState);
							scope.close();
						}

						// function checkItem(e, args) {
						// 	const field = args.grid.getColumns()[args.cell].field;
						// 	if (field === 'Checked') {
						// 		if (args.item.Checked) {
						// 			checkedProducts.set(args.item.Id, args.item);
						// 		} else {
						// 			checkedProducts.delete(args.item.Id);
						// 		}
						// 	}
						// 	updateOkButtonState();
						// }

						function updateOkButtonState() {
							scope.disableOkButton = checkedProducts.size === 0;
							if (scope.$root) {
								scope.$root.safeApply();
							} else {
								scope.$apply();
							}
						}

						function isCheckedValueChange(selectItem, newValue) {
							if(newValue === true){
								if(!checkedProducts.has(selectItem.Id)){
									checkedProducts.set(selectItem.Id, selectItem);
								}
							} else {
								if(checkedProducts.has(selectItem.Id)){
									checkedProducts.delete(selectItem.Id);
								}
							}
							updateOkButtonState();
							return {apply: true, valid: true, error: ''};
						}
						scope.isCheckedValueChange = isCheckedValueChange;

						scope.getPreselectedProductsFromProductContainer = function (){
							return preselectedProducts;
						}

						scope.updateCheckedProducts = function (products){
							checkedProducts.clear();
							products.forEach(product => {
								if (product.Checked && !checkedProducts.has(product.Id)) {
									checkedProducts.set(product.Id, product);
								}
							});
							updateOkButtonState();
						}

						if (angular.isFunction(scope.search)) {
							scope.search(undefined, true); // for preselecting products of selected PUs, search products immediately after opening product lookup dialog
						}
						setTimeout(function() {
							platformGridAPI.grids.resize('a70af18b20884ed19c3b4f15a5c58b88');
						}, 1000);

					}
				};
			}
		};

		service.onAddNewItem = function (item) {
			// todo if needs
		};

		//platformGridAPI.items.data('1fa2bbb32c83499f8f614a8c86f8d298', scope.entity.preselectionProducts);

		return service;
	}
})(angular);
