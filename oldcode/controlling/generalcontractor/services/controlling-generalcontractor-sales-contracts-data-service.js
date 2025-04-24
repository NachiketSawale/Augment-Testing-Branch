
(function () {
	/* global globals */
	'use strict';
	let module = angular.module('controlling.generalcontractor');

	module.factory('controllingGeneralContractorSalesContractsDataService', ['_', 'platformDataServiceFactory','$injector','$timeout','cloudDesktopPinningContextService','platformGridAPI',
		function (_,platformDataServiceFactory,$injector,$timeout,cloudDesktopPinningContextService,platformGridAPI) {
			let service ={};
			let gridId = {};
			let serviceOptions = {
				flatRootItem: {
					module: module,
					serviceName: 'controllingGeneralContractorSalesContractsDataService',
					entityNameTranslationID: 'controlling.generalcontractor.GeneralContractorControlling',
					httpRead: {
						route: globals.webApiBaseUrl + 'sales/contract/',
						endRead: 'getlistforgcsalescontract',
						usePostForRead: true,
						initReadData: function (readData) {
							let context = cloudDesktopPinningContextService.getContext();
							let item =_.find(context, {'token': 'project.main'});
							if (item) {
								readData.projectId = item.id;
							}
							return readData;
						}
					},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								data.isRoot = false;
								if(readData && readData[0] && readData[0].timeStr){
									console.log(readData[0].timeStr.m_StringValue);
								}
								return data.handleReadSucceeded(readData ? readData : [], data);
							}
						}
					},
					entityRole: {
						root: {
							itemName: 'salesContractsDataService',
							moduleName: 'controlling.generalcontractor.GeneralContractorControlling',
							codeField: 'Code',
							descField: 'DescriptionInfo.Translated'
						}
					},
					actions: {},
					entitySelection: {supportsMultiSelection: true}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
			service = serviceContainer.service;

			service.getProjectId = function getProjectId() {
				let context = cloudDesktopPinningContextService.getContext();
				let item =_.find(context, {'token': 'project.main'});
				return item ? item.id: -1;
			};

			service.getServiceContainerData = function getServiceContainerData() {
				return serviceContainer.data;
			};

			service.loadSalesContracts  = function () {
				service.setList([]);
				serviceContainer.data.itemList =[];

				if (service.getProjectId()>0 ) {
					$timeout(function () {
						service.load().then(
							function () {
								service.gridRefresh();
							}
						);
					});
				}
			};

			service.setShowHeaderAfterSelectionChanged(null);

			service.setGridId = function setGridId(value) {
				gridId = value;
			};

			service.refreshSalesContracts = function refreshSalesContracts() {
				let grid = platformGridAPI.grids.element('id', gridId);
				if(grid && grid.instance){
					service.load();
				}
			};

			return serviceContainer.service;
		}]);
})();
