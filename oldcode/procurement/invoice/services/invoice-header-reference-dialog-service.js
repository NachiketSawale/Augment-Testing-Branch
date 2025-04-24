(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	angular.module('procurement.invoice').factory('procurementInvoiceReferenceDialogService',
		['PlatformMessenger','$q',function (PlatformMessenger,$q) {
			var service = {}, self = this;

			service.setErrorMessage = function (message) {
				self.ErrorMessage = message;
			};

			service.getErrorMessage = function () {
				return self.ErrorMessage;
			};

			service.setCurrentItems = function (items) {
				self.dataItems = items;
			};

			service.getSelected = function () {
				var list = service.getList();
				if (list && list.length > 0) {
					return list[0];
				}
			};

			service.setSelected = function () {
				return $q.when();
			};

			service.getList = function () {
				return self.dataItems;
			};

			service.refreshGrid = function () {
				service.listLoaded.fire();
			};

			service.listLoaded = new PlatformMessenger();

			service.registerListLoaded = function registerListLoaded(callBackFn) {
				service.listLoaded.register(callBackFn);
			};
			service.unregisterListLoaded = function (callBackFn) {
				service.listLoaded.unregister(callBackFn);
			};

			service.unregisterSelectionChanged = function unregisterSelectionChanged() {

			};

			return service;
		}]);
})(angular);