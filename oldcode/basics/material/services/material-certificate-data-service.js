/**
 * Created by clv on 3/12/2018.
 */
/* global globals */
(function(angular){

	'use strict';
	var moduleName = 'basics.material';

	angular.module(moduleName).factory('basicsMaterial2CertificateDataService', basicsMaterial2CertificateDataService);
	basicsMaterial2CertificateDataService.$inject = [ 'platformDataServiceFactory', 'basicsMaterialRecordService',
		'basicsLookupdataLookupFilterService', 'basicsCommonReadOnlyProcessor'];

	function basicsMaterial2CertificateDataService( platformDataServiceFactory, basicsMaterialRecordService, lookupFilterService, basicsCommonReadOnlyProcessor){

		var serviceOption = {
			flatLeafItem: {
				module: angular.module(moduleName),
				serviceName: 'basicsMaterial2CertificateDataService',
				httpCreate: {route: globals.webApiBaseUrl + 'basics/material/certificate/'},
				httpRead: {route: globals.webApiBaseUrl + 'basics/material/certificate/'},
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							return data.handleReadSucceeded(readData, data);
						},
						initCreationData: initCreationData
					}
				},
				entityRole: {
					leaf: {
						itemName: 'Material2Certificate',
						parentService: basicsMaterialRecordService
					}
				},
				dataProcessor: [{processItem: readonlyProcessItem}],
				actions: {
					delete: {},
					create: 'flat',
					canCreateCallBackFunc: function () {
						return !basicsMaterialRecordService.isReadonlyMaterial();
					},
					canDeleteCallBackFunc: function () {
						return !basicsMaterialRecordService.isReadonlyMaterial();
					}
				}
			}
		};
		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
		var filters = [
			{
				key: 'material-certificate-material-filter',
				serverSide: true,
				fn: function(){
					var material = basicsMaterialRecordService.getSelected();
					return material !== null ? material.Id : -1;
				}
			}
		];
		lookupFilterService.registerFilter(filters);

		function initCreationData(creationData) { // todo livia
			var material = basicsMaterialRecordService.getSelected();
			creationData.mainItemId = material.Id;
			creationData.materialGroupFk = material.MaterialGroupFk;
		}

		var readonlyProcessorService = basicsCommonReadOnlyProcessor.createReadOnlyProcessor({
			uiStandardService: 'basicsMaterial2CertificateUIStandardService',
			readOnlyFields: []
		});
		function readonlyProcessItem(item) {
			if (!item) {
				return;
			}
			if (basicsMaterialRecordService.isReadonlyMaterial()) {
				readonlyProcessorService.setRowReadonlyFromLayout(item, true);
			}
		}

		return serviceContainer.service;
	}
})(angular);