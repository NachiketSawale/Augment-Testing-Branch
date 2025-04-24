/**
 * Created by alm on 5/26/2022.
 */

(function () {
	'use strict';
	let moduleName = 'procurement.requisition';

	angular.module(moduleName).factory('procurementRequisitionBoqVariantService', ['globals', '_', '$http', '$injector', 'moment', 'PlatformMessenger', 'platformGridAPI', 'platformDataServiceFactory', 'procurementRequisitionVariantService',
		function (globals, _, $http, $injector, moment, PlatformMessenger, platformGridAPI, platformDataServiceFactory, mainDataService) {

			let serviceOptions = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: 'procurementRequisitionBoqVariantService',
					httpRead: {
						route: globals.webApiBaseUrl + 'procurement/requisition/variant/',
						endRead: 'boqList'
					},
					presenter: {
						list: {
							incorporateDataRead: incorporateDataRead
						}
					},
					entityRole: {
						leaf: {
							itemName: 'RequisitionBoqVariant',
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

			service.loadBoqStructure = function (headerId,reqHeader) {
				let projectid=reqHeader.ProjectFk;
				let exchangeRate=reqHeader.ExchangeRate;
				let callingContextId=reqHeader.Id;
				return $http.get(globals.webApiBaseUrl + 'boq/main/getCompositeBoqItems?headerid=' + headerId + '&callingContextType=PrcRequisition&callingContextId='+callingContextId+'&projectid='+projectid+'&startID=0&depth=99&recalc=0&exchangeRate='+exchangeRate);

			};

			service.loadBoqVariant = function (variantId) {
				return $http.get(globals.webApiBaseUrl + 'procurement/requisition/variant/boqList?mainItemId=' + variantId);
			};

			service.saveBoqVariant = function (params) {
				return $http.post(globals.webApiBaseUrl + 'procurement/requisition/variant/saveBoqVariant', params);
			};

			return service;
		}]);
})();
