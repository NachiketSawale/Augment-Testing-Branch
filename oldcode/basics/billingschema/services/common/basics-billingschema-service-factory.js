/**
 * Created by wed on 5/16/2018.
 */

(function (angular) {

	'use strict';

	angular.module('basics.billingschema').factory('basicsBillingSchemaServiceFactory', [
		'$injector',
		'PlatformMessenger',
		'commonBillingSchemaDataService',
		function ($injector,
		          PlatformMessenger,
		          commonBillingSchemaDataService) {

			var serviceCache = {};

			function getDefaultOptions() {
				return {
					autoCreateWhenHeaderEntityCreated: false,
					onUpdateSuccessNotify: null
				};
			}

			function getService(qualifier, parentService, options) {
				var key = qualifier + parentService.getServiceName();
				if (serviceCache[key]) {
					return serviceCache[key];
				}
				var createOptions = angular.extend(getDefaultOptions(), options);
				serviceCache[key] = createService(qualifier, parentService, createOptions);
				return serviceCache[key];
			}

			function createService(qualifier, parentService, createOptions) {
				if (angular.isString(parentService)) {
					parentService = $injector.get(parentService);
				}
				var service = commonBillingSchemaDataService.getService(parentService, 'basics/billingschema/common/', createOptions);

				service.onValueChanged = new PlatformMessenger();
				service.getQualifier = function () {
					return qualifier;
				};

				service.recalculateForItem = function (item) {
					service.deleteAll();
					return service.copyFromBasicsBillingSchema(item);
				};

				service.copyFromBasicsBillingSchema = function (item) {
					return service.reloadItemsFromBill(item);
				};

				service.registerBillingSchemaChangeEvent = function () {
					if (parentService.BillingSchemaChanged && !service.isRegisterBillingSchemaChange) {
						service.isRegisterBillingSchemaChange = true;
						parentService.BillingSchemaChanged.register(recreateBillingSchema);
					}

					if (parentService.AsyncBillingSchemaChanged && !service.isRegisterAsyncBillingSchemaChange) {
						service.isRegisterAsyncBillingSchemaChange = true;
						parentService.AsyncBillingSchemaChanged.register(recreateBillingSchema);
					}
				};

				service.unregisterBillingSchemaChangeEvent = function () {
					if (parentService.BillingSchemaChanged && service.isRegisterBillingSchemaChange) {
						parentService.BillingSchemaChanged.unregister(recreateBillingSchema);
						service.isRegisterBillingSchemaChange = false;
					}

					if (parentService.AsyncBillingSchemaChanged && service.isRegisterAsyncBillingSchemaChange) {
						parentService.AsyncBillingSchemaChanged.unregister(recreateBillingSchema);
						service.isRegisterAsyncBillingSchemaChange = false;
					}
				};

				service.registerParentEntityCreateEvent = function () {
					if (createOptions.autoCreateWhenHeaderEntityCreated && !service.isRegisterParentEntityCreateEvent) {
						parentService.registerEntityCreated(parentEntityCreated);
						service.isRegisterParentEntityCreateEvent = true;
					}
				};

				service.unregisterParentEntityCreateEvent = function () {
					if (createOptions.autoCreateWhenHeaderEntityCreated && service.isRegisterParentEntityCreateEvent) {
						parentService.unregisterEntityCreated(parentEntityCreated);
						service.isRegisterParentEntityCreateEvent = false;
					}
				};

				service.disableRecalButton = function () {
					return !parentService.getSelected();
				};

				service.getParentSelected = function () {
					return parentService.getSelected();
				};

				function parentEntityCreated(e, item) {
					setTimeout(function () {
						service.copyFromBasicsBillingSchema(item);
					},500);
				}

				function recreateBillingSchema() {
					return service.recalculateForItem(parentService.getSelected());
				}

				return service;
			}

			return {
				getService: getService
			};

		}]);

})(angular);
