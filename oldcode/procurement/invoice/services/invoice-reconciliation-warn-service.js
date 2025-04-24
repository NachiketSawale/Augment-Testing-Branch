/**
 * Created by chk on 6/3/2016.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.invoice';

	angular.module(moduleName).factory('invoiceReconciliationWarnService', ['platformDataServiceFactory',
		function (platformDataServiceFactory) {

			var serviceOption = {
				module: angular.module(moduleName),
				serviceName: 'invoiceReconciliationWarnService',
				httpRead: {
					useLocalResource: true,
					resourceFunction: function () {
						return [];
					}
				},
				presenter: {list: {}},
				entitySelection: {},
				modification: {}
			};

			var container = platformDataServiceFactory.createNewComplete(serviceOption);

			container.data.markItemAsModified = function () {};
			container.service.markItemAsModified = function () {};

			return container.service;
		}
	]);
})(angular);