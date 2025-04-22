/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {


	'use strict';
	var moduleName = 'sales.bid';

	/**
	 * @ngdoc controller
	 * @name salesBidBillingSchemaListController
	 * @functiond
	 *
	 * @description
	 * Controller for the list view of billing (schema) entities.
	 **/
	angular.module(moduleName).controller('salesBidBillingSchemaListController',
		['_', '$scope', '$injector', 'platformGridAPI', 'platformContainerControllerService', 'salesBidBillingSchemaService', 'platformToolbarService', 'salesBidService', 'salesCommonGeneralsService',
			function (_, $scope, $injector, platformGridAPI, platformContainerControllerService, salesBidBillingSchemaService, platformToolbarService, salesBidService, salesCommonGeneralsService) {

				platformContainerControllerService.initController($scope, moduleName, '3DE6DDAA808C45D39F71803909CBB06A');

				var tools = [{
					id: 't1000',
					sort: 1000,
					caption: 'sales.bid.dirtyRecalculate',
					type: 'item',
					iconClass: 'control-icons ico-recalculate',
					disabled: function () {
						return _.isEmpty(salesBidService.getSelected());
					},
					fn: function updateCalculation() {
						// salesBidService.update().then(function(){
						salesBidBillingSchemaService.recalculateBillingSchema();
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

				salesBidBillingSchemaService.registerSelectionChanged(updateTools);

				// To do:when change general value, mark item to billing schema
				salesCommonGeneralsService.registerGeneralValueUpdate(onGeneralsCreated);

				function onGeneralsCreated(e, general) {
					angular.forEach(salesBidBillingSchemaService.getMergeItems(), function (billingSchema) {
						switch (billingSchema.BillingLineTypeFk) {
							case 8:
							case 10:
							case 13:
							case 14:
								if (billingSchema.GeneralsTypeFk === general.GeneralsTypeFk) {
									billingSchema.Value = general.Value;
									salesBidBillingSchemaService.markItemAsModified(billingSchema);
								}
								break;
						}
					});
					salesBidBillingSchemaService.setPostHiddenStatus(true);
				}

				salesCommonGeneralsService.registerGeneralsTypeUpdate(onGeneralsTypeUpdated);
				function onGeneralsTypeUpdated(e, args) {
					var updateBillingSchemaItem = function (item, value) {
						if (_.has(item, 'Value')) {
							item.Value = value;
							salesBidBillingSchemaService.markItemAsModified(item);
						}
					};
					var mergeItems = salesBidBillingSchemaService.getMergeItems();
					// reset old and set new
					updateBillingSchemaItem(_.find(mergeItems, {GeneralsTypeFk: args.generalTypeFkOld}), 0);
					updateBillingSchemaItem(_.find(mergeItems, {GeneralsTypeFk: args.generalTypeFkNew}), args.general.Value);

					salesBidBillingSchemaService.setPostHiddenStatus(true); // TODO: necessary here?
				}

				// To do: when delete general value, mark item to billing schema
				salesCommonGeneralsService.registerGeneralDelete(onGeneralsDelete);

				function onGeneralsDelete(e, deleteGenerals) {
					var mainItem = salesBidService.getSelected();
					salesBidBillingSchemaService.getBillingSchemaDetails(mainItem).then(function (billingSchemaDetails) {
						angular.forEach(salesBidBillingSchemaService.getMergeItems(), function (billingSchema) {
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
										salesBidBillingSchemaService.markItemAsModified(billingSchema);
									}
									break;
							}
						});
						salesBidBillingSchemaService.setPostHiddenStatus(true);
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
							var parentItem = salesBidService.getSelected();
							var exchangeRate = 0;
							if (parentItem && parentItem.Id) {
								exchangeRate = parentItem.ExchangeRate;
							}
							entity.Result = $injector.get('prcCommonCalculationHelper').round(entity.Value / exchangeRate);

							salesBidBillingSchemaService.markItemAsModified(entity);
						}
					}
				};
				platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);


				$scope.$on('$destroy', function () {
					salesBidBillingSchemaService.unregisterSelectionChanged(updateTools);
					salesCommonGeneralsService.unregisterGeneralValueUpdate(onGeneralsCreated);
					salesCommonGeneralsService.unregisterGeneralDelete(onGeneralsDelete);
					platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
				});
			}
		]);
})();
