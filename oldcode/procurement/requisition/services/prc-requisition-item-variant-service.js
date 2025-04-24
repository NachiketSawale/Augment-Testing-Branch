/**
 * Created by alm on 5/27/2022.
 */

(function () {
	'use strict';
	let moduleName = 'procurement.requisition';

	angular.module(moduleName).factory('procurementRequisitionItemVariantService', ['globals', '_', '$http', '$injector', 'moment', 'PlatformMessenger', 'platformGridAPI', 'platformDataServiceFactory', 'procurementRequisitionVariantService',
		function (globals, _, $http, $injector, moment, PlatformMessenger, platformGridAPI, platformDataServiceFactory, mainDataService) {

			let serviceOptions = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: 'procurementRequisitionItemVariantService',
					httpRead: {
						route: globals.webApiBaseUrl + 'procurement/requisition/variant/',
						endRead: 'itemlist'
					},
					presenter: {
						list: {
							incorporateDataRead: incorporateDataRead
						}
					},
					entityRole: {
						leaf: {
							itemName: 'RequisitionItemVariant',
							parentService: mainDataService
						}
					},
					actions: {
						delete: false,
						create: false
					}
				}
			};

			let container = platformDataServiceFactory.createNewComplete(serviceOptions);
			let service = container.service;
			container.data.usesCache = false;

			function incorporateDataRead(readItems, data) {

				return data.handleReadSucceeded(readItems, data, true);
			}

			service.loadItemVariant = function (variantId) {
				return $http.get(globals.webApiBaseUrl + 'procurement/requisition/variant/itemlist?mainItemId=' + variantId);
			};

			service.saveChangedItems = function (params) {
				return $http.post(globals.webApiBaseUrl + 'procurement/requisition/variant/saveItemVariant', params);
			};

			return service;
		}]);
})();
