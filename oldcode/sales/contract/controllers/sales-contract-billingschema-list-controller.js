/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {



	'use strict';
	var moduleName = 'sales.contract';

	/**
	 * @ngdoc controller
	 * @name salesContractBillingSchemaListController
	 * @functiond
	 *
	 * @description
	 * Controller for the list view of billing (schema) entities.
	 **/
	angular.module(moduleName).controller('salesContractBillingSchemaListController',
		['_', '$scope', '$injector', 'platformGridAPI', 'platformContainerControllerService', 'salesContractBillingSchemaService', 'platformToolbarService', 'salesContractService', 'salesCommonGeneralsService',
			function (_, $scope, $injector, platformGridAPI, platformContainerControllerService, salesContractBillingSchemaService, platformToolbarService, salesContractService, salesCommonGeneralsService) {

				platformContainerControllerService.initController($scope, moduleName, 'E303C8AE08B246348E6686882E17DFAE');

				var tools = [{
					id: 't1000',
					sort: 1000,
					caption: 'sales.contract.dirtyRecalculate',
					type: 'item',
					iconClass: 'control-icons ico-recalculate',
					disabled: function () {
						return _.isEmpty(salesContractService.getSelected());
					},
					fn: function updateCalculation() {
						// salesContractService.update().then(function(){
						salesContractBillingSchemaService.recalculateBillingSchema();
						// });
					}
				}, {
					id: 'd999',
					sort: 999,
					type: 'divider'
				}];

				$scope.addTools(tools);

				var updateTools = function () {
					if ($scope.tools) {
						$scope.tools.update();
					}
				};

				salesContractBillingSchemaService.registerSelectionChanged(updateTools);

				// To do:when change general value, mark item to billing schema
				salesCommonGeneralsService.registerGeneralValueUpdate(onGeneralsCreated);
				function onGeneralsCreated(e, general) {
					angular.forEach(salesContractBillingSchemaService.getMergeItems(), function (billingSchema) {
						switch (billingSchema.BillingLineTypeFk) {
							case 8:
							case 10:
							case 13:
							case 14:
								if (billingSchema.GeneralsTypeFk === general.GeneralsTypeFk) {
									billingSchema.Value = general.Value;
									salesContractBillingSchemaService.markItemAsModified(billingSchema);
								}
								break;
						}
					});
					salesContractBillingSchemaService.setPostHiddenStatus(true);
				}

				salesCommonGeneralsService.registerGeneralsTypeUpdate(onGeneralsTypeUpdated);
				function onGeneralsTypeUpdated(e, args) {
					var updateBillingSchemaItem = function (item, value) {
						if (_.has(item, 'Value')) {
							item.Value = value;
							salesContractBillingSchemaService.markItemAsModified(item);
						}
					};
					var mergeItems = salesContractBillingSchemaService.getMergeItems();
					// reset old and set new
					updateBillingSchemaItem(_.find(mergeItems, {GeneralsTypeFk: args.generalTypeFkOld}), 0);
					updateBillingSchemaItem(_.find(mergeItems, {GeneralsTypeFk: args.generalTypeFkNew}), args.general.Value);

					salesContractBillingSchemaService.setPostHiddenStatus(true); // TODO: necessary here?
				}

				salesCommonGeneralsService.registerGeneralDelete(onGeneralsDelete);
				function onGeneralsDelete(e, deleteGenerals) {
					var mainItem = salesContractService.getSelected();
					salesContractBillingSchemaService.getBillingSchemaDetails(mainItem).then(function (billingSchemaDetails) {
						angular.forEach(salesContractBillingSchemaService.getMergeItems(), function (billingSchema) {
							switch (billingSchema.BillingLineTypeFk) {
								case 8:
								case 10:
								case 13:
								case 14:
									var deleteGeneral = _.find(deleteGenerals, {'GeneralsTypeFk': billingSchema.GeneralsTypeFk});
									if (deleteGeneral) {
										var billingSchmaValue = null;
										angular.forEach(billingSchemaDetails, function (billingSchemaDetail) {
											if (billingSchemaDetail.Id === billingSchema.MdcBillingSchemaDetailFk) {
												billingSchmaValue = billingSchemaDetail.Value;
											}
										});
										billingSchema.Value = billingSchmaValue;
										salesContractBillingSchemaService.markItemAsModified(billingSchema);
									}
									break;
							}
						});
						salesContractBillingSchemaService.setPostHiddenStatus(true);
					});
				}

				var onCellChange = function (e, args) {
					var col = args.grid.getColumns()[args.cell].field;
					var entity = args.item;
					if (entity && col === 'Value') {
						var billingLineTypeFk = [23];
						var isInLineType = _.indexOf(billingLineTypeFk, entity.BillingLineTypeFk) === 0;
						if (isInLineType) {
							entity.IsModification = true;
							entity.ResultOc = entity.Value;
							var parentItem = salesContractService.getSelected();
							var exchangeRate = 0;
							if (parentItem && parentItem.Id) {
								exchangeRate = parentItem.ExchangeRate;
							}
							entity.Result = $injector.get('prcCommonCalculationHelper').round(entity.Value / exchangeRate);

							salesContractBillingSchemaService.markItemAsModified(entity);
						}
					}
				};
				platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

				$scope.$on('$destroy', function () {
					salesContractBillingSchemaService.unregisterSelectionChanged(updateTools);
					salesCommonGeneralsService.unregisterGeneralValueUpdate(onGeneralsCreated);
					salesCommonGeneralsService.unregisterGeneralDelete(onGeneralsDelete);
					platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
				});
			}
		]);
})();
