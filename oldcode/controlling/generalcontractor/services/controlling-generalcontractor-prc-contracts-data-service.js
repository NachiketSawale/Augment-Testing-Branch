(function () {
	/* global globals */
	'use strict';
	let module = angular.module('controlling.generalcontractor');

	module.factory('controllingGeneralContractorPrcContractsDataService', ['_', 'platformDataServiceFactory', 'controllingGeneralcontractorCostControlDataService', 'cloudDesktopPinningContextService', 'basicsLookupdataLookupDescriptorService',
		function (_, platformDataServiceFactory, parentService, cloudDesktopPinningContextService, basicsLookupdataLookupDescriptorService) {
			let serviceOptions = {
				flatLeafItem: {
					module: module,
					serviceName: 'controllingGeneralContractorPrcContractsDataService',
					entityNameTranslationID: 'controlling.generalcontractor.GeneralContractorControlling',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'Controlling/GeneralContractor/PrcContractsController/', // adapt to web API controller
						endRead: 'getPrcContractsByCondition',
						usePostForRead: true,
						initReadData: function (readData) {
							let projectContext = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
							if(projectContext){
								readData.ProjectId = projectContext.id;
							} else {
								readData.ProjectId = -1;
							}
							readData.MdcControllingUnitFks = parentService.getMdcIds();
							readData.DueDate = parentService.getSelectedDueDate()? parentService.getSelectedDueDate():null;
							return readData;
						}
					},
					actions: {},
					entityRole: {
						leaf: {itemName: 'PrcContracts', parentService: parentService}
					},
					entitySelection: {supportsMultiSelection: true},
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

			basicsLookupdataLookupDescriptorService.loadData('ConStatus');

			serviceContainer.service.refreshData = function () {
				if(!parentService.getSelected()){
					serviceContainer.service.setList([]);
					serviceContainer.data.itemList =[];
					serviceContainer.service.gridRefresh();
				}
			};

			return serviceContainer.service;
		}]);
})();
