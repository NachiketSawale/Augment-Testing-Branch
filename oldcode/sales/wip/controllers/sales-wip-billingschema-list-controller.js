/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var moduleName = 'sales.wip';

	/**
	 * @ngdoc controller
	 * @name salesWipBillingSchemaListController
	 * @description
	 * Controller for the list view of billing (schema) entities.
	 **/
	angular.module(moduleName).controller('salesWipBillingSchemaListController',
		['_', '$scope', 'platformContainerControllerService', 'salesWipBillingSchemaService', 'platformToolbarService', 'salesWipService', 'salesCommonGeneralsService',
			function (_, $scope, platformContainerControllerService, salesWipBillingSchemaService, platformToolbarService, salesWipService, salesCommonGeneralsService) {

				platformContainerControllerService.initController($scope, moduleName, 'c8faaacfa60c4790845e06aafd370ec5');

				var tools = [{
					id: 't1000',
					sort: 1000,
					caption: 'sales.wip.dirtyRecalculate',
					type: 'item',
					iconClass: 'control-icons ico-recalculate',
					disabled: function () {
						return _.isEmpty(salesWipService.getSelected());
					},
					fn: function updateCalculation() {
						salesWipService.update().then(function () {
							salesWipBillingSchemaService.recalculateBillingSchema();
						});
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

				salesWipBillingSchemaService.registerSelectionChanged(updateTools);

				// To do:when change general value, mark item to billing schema
				salesCommonGeneralsService.registerGeneralValueUpdate(onGeneralsCreated);

				function onGeneralsCreated(e, general) {
					angular.forEach(salesWipBillingSchemaService.getMergeItems(), function (billingSchema) {
						switch (billingSchema.BillingLineTypeFk) {
							case 8:
							case 10:
							case 13:
							case 14:
								if (billingSchema.GeneralsTypeFk === general.GeneralsTypeFk) {
									billingSchema.Value = general.Value;
									salesWipBillingSchemaService.markItemAsModified(billingSchema);
								}
								break;
						}
					});
					salesWipBillingSchemaService.setPostHiddenStatus(true);
				}

				salesCommonGeneralsService.registerGeneralsTypeUpdate(onGeneralsTypeUpdated);

				function onGeneralsTypeUpdated(e, args) {
					var updateBillingSchemaItem = function (item, value) {
						if (_.has(item, 'Value')) {
							item.Value = value;
							salesWipBillingSchemaService.markItemAsModified(item);
						}
					};
					var mergeItems = salesWipBillingSchemaService.getMergeItems();
					// reset old and set new
					updateBillingSchemaItem(_.find(mergeItems, {GeneralsTypeFk: args.generalTypeFkOld}), 0);
					updateBillingSchemaItem(_.find(mergeItems, {GeneralsTypeFk: args.generalTypeFkNew}), args.general.Value);

					salesWipBillingSchemaService.setPostHiddenStatus(true); // TODO: necessary here?
				}

				salesCommonGeneralsService.registerGeneralDelete(onGeneralsDelete);

				function onGeneralsDelete(e, deleteGenerals) {
					var mainItem = salesWipService.getSelected();
					salesWipBillingSchemaService.getBillingSchemaDetails(mainItem).then(function (billingSchemaDetails) {
						angular.forEach(salesWipBillingSchemaService.getMergeItems(), function (billingSchema) {
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
										salesWipBillingSchemaService.markItemAsModified(billingSchema);
									}
									break;
							}
						});
						salesWipBillingSchemaService.setPostHiddenStatus(true);
					});
				}

				$scope.$on('$destroy', function () {
					salesWipBillingSchemaService.unregisterSelectionChanged(updateTools);
					salesCommonGeneralsService.unregisterGeneralValueUpdate(onGeneralsCreated);
					salesCommonGeneralsService.unregisterGeneralsTypeUpdate(onGeneralsTypeUpdated);
					salesCommonGeneralsService.unregisterGeneralDelete(onGeneralsDelete);
				});
			}
		]);
})();
