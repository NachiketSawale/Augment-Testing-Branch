/*
 * Created by lnb on 6/5/2015.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.invoice').controller('invoiceBillingSchemaGridController',
		['$scope', '$translate', 'procurementInvoiceGridControllerService', 'invoiceBillingSchemaDataService', 'procurementInvoiceBillingSchemaUIStandardService', 'procurementInvoiceHeaderDataService',
			'platformToolbarService', 'procurementInvoiceBillingSchemaValidationService',
			// eslint-disable-next-line func-names
			function ($scope, $translate, gridControllerService, dataService, gridColumns,
				// eslint-disable-next-line no-mixed-spaces-and-tabs
				invoiceHeaderDataService, platformToolbarService, validationService) {
				var gridConfig = {
					initCalled: false,
					columns: []
				};

				dataService.createItem = false;
				dataService.deleteItem = false;

				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

				$scope.addTools([{
					id: 't1000',
					sort: 1000,
					caption: $translate.instant('procurement.common.total.dirtyRecalculate'),
					type: 'item',
					iconClass: 'control-icons ico-recalculate',
					permission: '#w',
					disabled: function () {
						var that = this;
						var itemStatus = invoiceHeaderDataService.getItemStatus();
						if (itemStatus.IsReadOnly) {
							return true;
						} else {
							if (that.isCalculating) {
								return true;
							} else {
								return dataService.getList().length === 0;
							}
						}
					},
					fn: function updateCalculation() {
						// dataService.updateCalculation();
						// TODO:workaround, it should use one request to reload and also calculate it
						var that = this;
						var updateList = dataService.getList();
						if (!that.isCalculating) {
							that.isCalculating = true;
							dataService.reloadBillingSchemas(undefined, undefined, true).then(function () {
								var mUpdateData = function (updateData) {
									if (that.isCalculating) {
										mergeUpdateData(updateData, updateList);
									}
								};
								invoiceHeaderDataService.registerUpdateDataExtensionEvent(mUpdateData);
								// fix defect:79362,made billingSchema entities version > 0 then set flag false
								// eslint-disable-next-line func-names
								invoiceHeaderDataService.update().finally(function () {
									that.isCalculating = false;
									invoiceHeaderDataService.unregisterUpdateDataExtensionEvent(mUpdateData);
								});
								// eslint-disable-next-line func-names
							}, function () {
								that.isCalculating = false;
							});
						}

					}
				}]);

				// eslint-disable-next-line no-undef,func-names
				_.remove($scope.tools.items, function (item) {
					return item && item.id === 'create' && item.id === 'delete';
				});

				var updateTools = function () {
					if ($scope.tools) {
						$scope.tools.update();
					}
				};

				function mergeUpdateData(updateData, updateList) {
					// BillingLineTypeFk: 19==>Dif. Discount Basis
					var saveEntities = _.filter(updateData.BillingSchemaToSave, {BillingLineTypeFk: 19});
					if (updateData.BillingSchemaToDelete) {
						// eslint-disable-next-line no-undef
						_.forEach(saveEntities, function (entity) {
							var _findEntity = _.find(updateData.BillingSchemaToDelete, {
								BillingLineTypeFk: 19,// Dif. Discount Basis
								Sorting: entity.Sorting
							});
							if (_findEntity) {
								entity.Result = _findEntity.Result;
								entity.ResultOc = _findEntity.ResultOc;
							}
						});
					}

					var billingLineTypeFk = [8, 10, 17, 20, 23, 28];
					if (updateList) {
						_.forEach(billingLineTypeFk, function (typefk) {
							// BillingLineTypeFk: 8,10,17,20,23,28
							saveEntities = _.filter(updateData.BillingSchemaToSave, {BillingLineTypeFk: typefk});
							// eslint-disable-next-line no-undef
							_.forEach(saveEntities, function (entity) {
								var _findEntity = _.find(updateList, {
									BillingLineTypeFk: typefk,
									Sorting: entity.Sorting
								});
								if (_findEntity && entity.IsEditable) {
									entity.Value = _findEntity.Value;
								}
							});
						});
					}
				}

				invoiceHeaderDataService.registerSelectionChanged(updateTools);

			}]);
})(angular);