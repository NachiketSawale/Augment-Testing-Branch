/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function () {

	'use strict';
	var moduleName = 'sales.billing';

	/**
	 * @ngdoc controller
	 * @name salesBillingSchemaListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of billing (schema) entities.
	 **/
	angular.module(moduleName).controller('salesBillingSchemaListController',
		['_', '$scope', 'platformContainerControllerService', 'salesBillingSchemaService', 'platformToolbarService', 'salesBillingService', 'salesCommonGeneralsService',
			function (_, $scope, platformContainerControllerService, salesBillingSchemaService, platformToolbarService, salesBillingService, salesCommonGeneralsService) {

				platformContainerControllerService.initController($scope, moduleName, '9715B5644BB84661985187E09AE646AC');

				var tools = [{
					id: 't1000',
					sort: 1000,
					caption: 'sales.billing.dirtyRecalculate',
					type: 'item',
					iconClass: 'control-icons ico-recalculate',
					disabled: function () {
						return _.isEmpty(salesBillingService.getSelected());
					},
					fn: function updateCalculation() {
						salesBillingSchemaService.recalculateBillingSchema();
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

				salesBillingSchemaService.registerSelectionChanged(updateTools);

				// To do:when change general value, mark item to billing schema
				salesCommonGeneralsService.registerGeneralValueUpdate(onGeneralsCreated);
				function onGeneralsCreated(e, general) {
					angular.forEach(salesBillingSchemaService.getMergeItems(), function (billingSchema) {
						switch (billingSchema.BillingLineTypeFk) {
							case 8:
							case 10:
							case 13:
							case 14:
								if (billingSchema.GeneralsTypeFk === general.GeneralsTypeFk) {
									billingSchema.Value = general.Value;
									salesBillingSchemaService.markItemAsModified(billingSchema);
								}
								break;
						}
					});
					salesBillingSchemaService.setPostHiddenStatus(true);
				}

				salesCommonGeneralsService.registerGeneralsTypeUpdate(onGeneralsTypeUpdated);
				function onGeneralsTypeUpdated(e, args) {
					var updateBillingSchemaItem = function (item, value) {
						if (_.has(item, 'Value')) {
							item.Value = value;
							salesBillingSchemaService.markItemAsModified(item);
						}
					};
					var mergeItems = salesBillingSchemaService.getMergeItems();
					// reset old and set new
					updateBillingSchemaItem(_.find(mergeItems, {GeneralsTypeFk: args.generalTypeFkOld}), 0);
					updateBillingSchemaItem(_.find(mergeItems, {GeneralsTypeFk: args.generalTypeFkNew}), args.general.Value);

					salesBillingSchemaService.setPostHiddenStatus(true); // TODO: necessary here?
				}

				salesCommonGeneralsService.registerControllingUnitOrTaxCodeChange(onGeneralsCuOrTcChange);
				function onGeneralsCuOrTcChange(e, result){
					angular.forEach(salesBillingSchemaService.getMergeItems(),function(billingSchema){
						switch(billingSchema.BillingLineTypeFk){
							case 8:
							case 10:
								if(billingSchema.GeneralsTypeFk === result.entity.GeneralsTypeFk){
									if (result.model === 'ControllingUnitFk') {
										billingSchema.ControllingUnitFk = result.value;
									}
									else if (result.model === 'TaxCodeFk') {
										billingSchema.TaxCodeFk = result.value;
									}
									salesBillingSchemaService.markItemAsModified(billingSchema);
								}
								break;
						}
					});
					salesBillingSchemaService.setPostHiddenStatus(true);
				}

				// TODO: the code have removed to service
				/* var service = commonBillingSchemaDataService.getService(salesBillingService,'sales/contract/schema/');
				service.billBillingSchemaChanged.register(billUpdateSpecification);
				function billUpdateSpecification(billingSchema) {
					if (billingSchema) {
						angular.forEach(billingSchema, function (billingSchema) {
							$http({
								method: 'GET',
								url: globals.webApiBaseUrl + 'sales/billing/generals/list?mainItemId=' + billingSchema.HeaderFk
							}).then(function(response){
								//return response.data;
								switch (billingSchema.BillingLineTypeFk) {
									case 8:
									case 10:
									case 13:
									case 14:
										angular.forEach(response.data,function (general){
											if (billingSchema.GeneralsTypeFk === general.GeneralsTypeFk) {
												billingSchema.Value = general.Value;
												salesBillingSchemaService.markItemAsModified(billingSchema);
											}
										});
										break;
								}
							});
						});
					}
				} */

				salesCommonGeneralsService.registerGeneralDelete(onGeneralsDelete);
				function onGeneralsDelete(e, deleteGenerals) {
					var mainItem = salesBillingService.getSelected();
					salesBillingSchemaService.getBillingSchemaDetails(mainItem).then(function (billingSchemaDetails) {
						angular.forEach(salesBillingSchemaService.getMergeItems(), function (billingSchema) {
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
										salesBillingSchemaService.markItemAsModified(billingSchema);
									}
									break;
							}
						});
						salesBillingSchemaService.setPostHiddenStatus(true);
					});
				}

				$scope.$on('$destroy', function () {
					salesBillingSchemaService.unregisterSelectionChanged(updateTools);
					salesCommonGeneralsService.unregisterGeneralValueUpdate(onGeneralsCreated);
					salesCommonGeneralsService.unregisterGeneralsTypeUpdate(onGeneralsTypeUpdated);
					salesCommonGeneralsService.unregisterGeneralDelete(onGeneralsDelete);
				});
			}
		]);
})();
