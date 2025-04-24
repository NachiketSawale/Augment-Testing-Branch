/**
 * Created by shen on 4/15/2023
 */

(function (angular) {
	'use strict';
	let moduleName =  angular.module('procurement.common');

	/**
	 * @ngdoc service
	 * @name prcCommonItem2plantDataService
	 * @description provides prc common item2plant entities
	 */

	moduleName.service('prcCommonItem2plantDataService', PrcCommonItem2plantDataService);

	PrcCommonItem2plantDataService.$inject= ['_', '$q', '$http', 'globals', 'procurementContextService', 'platformDataServiceFactory', 'procurementCommonDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'platformRuntimeDataService'];

	function PrcCommonItem2plantDataService(_, $q, $http, globals, procurementContextService, platformDataServiceFactory, dataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, platformRuntimeDataService) {

		return dataServiceFactory.createService(constructorFn, 'prcCommonItem2plantDataService');

		function constructorFn(parentDataService){

			let factoryOptions = {
				flatLeafItem: {
					module: 'procurement.common',
					serviceName: 'prcCommonItem2plantDataService',
					httpRead: {
						route: globals.webApiBaseUrl + 'procurement/common/prcitem2plant/',
						endRead: 'listbyparent',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							let selected = parentDataService.getSelected();
							readData.PKey1 = selected.Id;

						}
					},
					actions: {delete: false, create: false},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
						{
							typeName: 'StockTotalVDto',
							moduleSubModule: 'Resource.Requisition'
						}
					), {processItem: setContainerToReadOnly}],
					entityRole: {
						leaf: {itemName: 'PrcItem2PlantDto', parentService: parentDataService}
					}
				}
			};

			function setContainerToReadOnly(item) {
				platformRuntimeDataService.readonly(item, true);
			}
			let serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			let service = serviceContainer.service;

			return service;
		}
	}

})(angular);