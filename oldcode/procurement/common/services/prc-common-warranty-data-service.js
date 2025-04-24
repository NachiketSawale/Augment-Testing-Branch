/**
 * Created by yew on 11/06/2019.
 */
(function (angular) {

	'use strict';
	var moduleName = 'procurement.common';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	angular.module(moduleName).factory('procurementCommonWarrantyDataService', procurementCommonWarrantyDataService);
	procurementCommonWarrantyDataService.$inject = ['platformDataServiceFactory','procurementCommonDataServiceFactory','ServiceDataProcessDatesExtension'];

	function procurementCommonWarrantyDataService(platformDataServiceFactory, procurementCommonDataServiceFactory, ServiceDataProcessDatesExtension) {
		function constructorFn(parentDataService) {
			var serviceOption = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: 'procurementCommonWarrantyDataService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'procurement/common/warranty/',
						endRead: 'list',
						initReadData: initReadData
					},
					dataProcessor: [new ServiceDataProcessDatesExtension(['HandoverDate','WarrantyEnddate','UserDefinedDate1','UserDefinedDate2','UserDefinedDate3','UserDefinedDate4','UserDefinedDate5'])],
					presenter: {
						list: {
							incorporateDataRead: incorporateDataRead,
							initCreationData: function initCreationData(creationData) {
								var prcHeader = parentDataService.getSelected().PrcHeaderEntity;
								creationData.PrcHeaderFk = prcHeader.Id;
							}
						}
					},
					entityRole: {
						leaf: {
							itemName: 'PrcWarranty',
							parentService: parentDataService
						}
					}
				}
			};
			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

			var service = serviceContainer.service;

			var setReadonlyor = function () {
				var getModuleStatusFn = parentDataService.getItemStatus || parentDataService.getModuleState;
				if (getModuleStatusFn) {
					var status = getModuleStatusFn();
					return !(status.IsReadOnly || status.IsReadonly);
				}
				return false;
			};

			service.canCreate = function () {
				return true;
			};
			var canDelete = serviceContainer.service.canDelete;
			service.canDelete = function () {
				return canDelete() && setReadonlyor();
			};

			function initReadData(readData) {
				readData.filter = '?mainItemId=' + parentDataService.getSelected().PrcHeaderEntity.Id;
			}

			function incorporateDataRead(readData, data){
				var Isreadonly = !setReadonlyor();
				var itemList = data.handleReadSucceeded(readData, data, true);
				if (Isreadonly) {
					service.setReadOnlyRow(readData);
				}
				return itemList;
			}
			return service;
		}
		return procurementCommonDataServiceFactory.createService(constructorFn, 'procurementCommonWarrantyDataService');
	}
})(angular);