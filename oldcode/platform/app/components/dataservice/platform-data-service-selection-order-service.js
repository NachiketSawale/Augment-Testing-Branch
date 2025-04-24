/*
 * $Id: platform-data-service-selection-order-service.js 550272 2019-07-05 16:46:13Z haagf $
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platformDataServiceSelectionOrderService
	 * @function
	 *
	 * @description Keeps track of the order in which the selection was changed in data services.
	 */
	angular.module('platform').factory('platformDataServiceSelectionOrderService', ['_', '$injector', '$log',
		'PlatformMessenger',
		function (_, $injector, $log, PlatformMessenger) {
			var service = {};

			var privateState = {
				lastChangedSelection: [], // the services whose selection was last changed in reverse order (i.e. the last service was most recently reselected)
				watchedServices: {},
				onOrderChanged: new PlatformMessenger(),
				fireOrderChanged: _.debounce(function () {
					privateState.onOrderChanged.fire();
				}, 10)
			};

			function getDsInfo(service) {
				var ds = _.isString(service) ? $injector.get(service) : service;
				if (_.isNil(ds)) {
					$log.warn('Failed to retrieve data service, as data service reference was empty.');
					return;
				}

				var dsName = ds.getServiceName();
				if (!_.isString(dsName)) {
					throw new Error('A data service processed by data service selection order service does not return a valid name.');
				}

				return {
					service: ds,
					name: dsName
				};
			}

			service.watchService = function (service) {
				var dsInfo = getDsInfo(service);
				if (!privateState.watchedServices[dsInfo.name]) {
					privateState.watchedServices[dsInfo.name] = true;
					service.registerSelectedEntitiesChanged(function () {
						var oldIdx = privateState.lastChangedSelection.indexOf(dsInfo.name);
						if (oldIdx >= 0) {
							privateState.lastChangedSelection.splice(oldIdx, 1);
						}
						privateState.lastChangedSelection.push(dsInfo.name);

						privateState.fireOrderChanged();
					});
				}
			};

			service.registerOrderChanged = function (handler) {
				privateState.onOrderChanged.register(handler);
			};

			service.unregisterOrderChanged = function (handler) {
				privateState.onOrderChanged.unregister(handler);
			};

			service.orderServices = function (services, excludeUnordered) {
				var normalizedItems = _.compact(_.map(services, function (svc) {
					var result = {
						value: svc,
						index: privateState.lastChangedSelection.indexOf(getDsInfo(svc).name)
					};
					if (excludeUnordered && (result.index < 0)) {
						return null;
					}
					return result;
				}));
				normalizedItems.sort(function (a, b) {
					if (a.index > b.index) {
						return -1;
					} else if (a.index < b.index) {
						return 1;
					} else {
						return 0;
					}
				});
				return _.map(normalizedItems, function (item) {
					return item.value;
				});
			};

			return service;
		}]);
})();