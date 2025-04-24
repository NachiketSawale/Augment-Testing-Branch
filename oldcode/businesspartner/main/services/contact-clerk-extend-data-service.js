/**
 * Created by lsi on 8/1/2019.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	var moduleName = 'businesspartner.main';
	angular.module(moduleName).factory('businesspartnerMainContactClerkExtendDataService', contactClerkExtendDataService);
	contactClerkExtendDataService.$inject = [];

	function contactClerkExtendDataService() {
		var service = {};
		service.beforeInitAdditionalServices = beforeInitAdditionalServices;

		function beforeInitAdditionalServices(container) {
			if (container) {
				var clerkService = container.service;
				var oldStoreCacheFor = container.data.storeCacheFor;
				container.data.storeCacheFor = function storeCacheFor(item, data) {
					var foundInValidData = _.find(data.itemList, function (dataItem) {
						return dataItem.MainItemFk !== item.Id;
					});
					if (foundInValidData) {
						return;
					}
					oldStoreCacheFor(item, data);
				};

				clerkService.storeCacheForCopy = function (item) {
					container.data.storeCacheFor(item, container.data);
				};
			}
		}

		service.InitAdditionalServices = InitAdditionalServices;

		function InitAdditionalServices() {

		}

		return service;
	}
})(angular);