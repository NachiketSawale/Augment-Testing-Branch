/**
 * Created by wwa on 12/10/2015.
 */
// eslint-disable-next-line no-redeclare
/* global angular,_ */

(function (angular) {
	'use strict';
	// var module = angular.module('procurement.invoice');

	/* jshint -W072 */ // many parameters because of dependency injection
	var modName = 'procurement.stock';
	angular.module(modName).factory('procurementStockStockTotalReconciliation2DataService',
		['procurementStockStockTotalDataService', '$translate', '$q', 'PlatformMessenger', function (parentService, $translate, $q, PlatformMessenger) {

			var service = {}, self = this;

			service.refreshGrid = new PlatformMessenger();

			self.currentItem = null;
			service.parentService = parentService;
			service.registerListLoaded = function registerListLoaded(callBackFn) {
				service.refreshGrid.register(callBackFn);
			};

			service.unregisterListLoaded = function unregisterListLoaded(callBackFn) {
				service.refreshGrid.unregister(callBackFn);
			};

			service.getList = function getList() {
				var parentItem = parentService.getSelected() || {};

				var list = [], index = 0;
				list.push({
					Id: index++, Type: $translate.instant('procurement.stock.header.totalquantity'),
					Receipt: parentItem.QuantityReceipt,
					Consumed: parentItem.QuantityConsumed,
					Difference: parentItem.TotalQuantity
				});
				list.push({
					Id: index++, Type: $translate.instant('procurement.stock.header.totalvalue'),
					Receipt: parentItem.TotalReceipt,
					Consumed: parentItem.TotalConsumed,
					Difference: parentItem.TotalValue
				});
				list.push({
					Id: index++,
					Type: $translate.instant('procurement.stock.header.totalprovision'),
					Receipt: parentItem.ProvisionReceipt,
					Consumed: parentItem.ProvisionConsumed,
					Difference: parentItem.TotalProvision

				});
				// noinspection JSUnusedAssignment
				list.push({
					Id: index++,
					Type: $translate.instant('procurement.stock.header.expenses'),
					Receipt: parentItem.ExpenseTotal,
					Consumed: parentItem.ProvisionReceipt,
					Difference: parentItem.Expenses

				});
				return list;
			};

			service.getSelected = function getSelected() {
				return self.currentItem;
			};

			service.setSelected = function setSelected(item) {
				self.currentItem = item;
				return $q.when(item);
			};

			function onParentItemChanged() {
				service.refreshGrid.fire();
			}

			parentService.registerSelectionChanged(onParentItemChanged);

			service.hasSelection = function hasSelection() {
				return !_.isNull(self.currentItem) && !_.isUndefined(self.currentItem);
			};

			return service;
		}]);
})(angular);
