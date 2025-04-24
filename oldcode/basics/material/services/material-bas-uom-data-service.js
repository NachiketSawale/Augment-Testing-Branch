/**
 * Created by yew on 9/25/2019.
 */
(function(angular){

	'use strict';
	/* global globals */
	var moduleName = 'basics.material';

	angular.module(moduleName).factory('basicsMaterial2basUomDataService', basicsMaterial2basUomDataService);
	basicsMaterial2basUomDataService.$inject = [ 'platformDataServiceFactory', 'basicsMaterialRecordService',
		'basicsLookupdataLookupFilterService', 'basicsCommonReadOnlyProcessor'];

	function basicsMaterial2basUomDataService( platformDataServiceFactory, basicsMaterialRecordService, lookupFilterService, basicsCommonReadOnlyProcessor){

		var serviceOption = {
			flatLeafItem: {
				module: angular.module(moduleName),
				serviceName: 'basicsMaterial2basUomDataService',
				httpCreate: {route: globals.webApiBaseUrl + 'basics/material/basuom/'},
				httpRead: {route: globals.webApiBaseUrl + 'basics/material/basuom/'},
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
						itemName: 'Material2basUom',
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
				key: 'material-basuom-material-filter',
				serverSide: true,
				fn: function(){
					var material = basicsMaterialRecordService.getSelected();
					return material !== null ? material.Id : -1;
				}
			}
		];
		lookupFilterService.registerFilter(filters);

		function initCreationData(creationData) {
			var material = basicsMaterialRecordService.getSelected();
			creationData.mainItemId = material.Id;
		}

		var readonlyProcessorService = basicsCommonReadOnlyProcessor.createReadOnlyProcessor({
			uiStandardService: 'basicsMaterial2basUomUIStandardService',
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