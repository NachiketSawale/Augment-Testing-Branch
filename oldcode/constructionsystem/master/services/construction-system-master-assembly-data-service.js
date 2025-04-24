/**
 * Created by xsi on 2015-12-14.
 */

(function (angular) {
	'use strict';
	/* global globals */
	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).factory('constructionSystemMasterAssemblyService',
		['platformDataServiceFactory', 'constructionSystemMasterHeaderService',
			'basicsLookupdataLookupDescriptorService', 'platformRuntimeDataService',
			/* jshint -W072 */
			function (platformDataServiceFactory, constructionSystemMasterHeaderService, basicsLookupdataLookupDescriptorService, platformRuntimeDataService) {

				var serviceOptions = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'constructionSystemMasterAssemblyService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'constructionsystem/master/assembly/',
							endRead: 'list'
						},
						presenter: {
							list: {
								incorporateDataRead: incorporateDataRead
							}
						},
						entityRole: {
							leaf: {
								itemName: 'CosAssembly',
								parentService: constructionSystemMasterHeaderService
							}
						},
						dataProcessor: [{processItem: processData}]
					}
				};
				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
				return serviceContainer.service;

				function incorporateDataRead(readItems, data) {
					basicsLookupdataLookupDescriptorService.attachData(readItems || {});
					serviceContainer.data.handleReadSucceeded(readItems.dtos, data);
				}
				function processData(newItem) {
					if (newItem.EstLineItemFk === 0) {
						newItem.EstLineItemFk = null;
					}
					if (newItem.EstAssemblyCatFk === 0) {
						newItem.EstAssemblyCatFk = null;
					}
					platformRuntimeDataService.readonly(newItem, [{field: 'EstAssemblyCatFk', readonly: true}]);
				}

			}]);

})(angular);