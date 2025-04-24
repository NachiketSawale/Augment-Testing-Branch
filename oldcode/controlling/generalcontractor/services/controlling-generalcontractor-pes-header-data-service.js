(function () {
	/* global globals */
	'use strict';
	let module = angular.module('controlling.generalcontractor');

	module.factory('controllingGeneralContractorPesHeaderDataService', ['_','platformDataServiceFactory', 'controllingGeneralcontractorCostControlDataService','basicsLookupdataLookupDescriptorService','cloudDesktopPinningContextService',
		function (_,platformDataServiceFactory, parentService,basicsLookupdataLookupDescriptorService,cloudDesktopPinningContextService) {

			let serviceOptions = {
				flatLeafItem: {
					module: module,
					serviceName: 'controllingGeneralContractorPesHeaderDataService',
					entityNameTranslationID: 'controlling.generalcontractor.GeneralContractorControlling',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'Controlling/GeneralContractor/PesHeadController/', // adapt to web API controller
						endRead: 'getPesHeadByCondition',
						usePostForRead: true,
						initReadData: function (readData) {

							let projectContext = _.find (cloudDesktopPinningContextService.getContext (), {token: 'project.main'});
							if (projectContext) {
								readData.ProjectId = projectContext.id;
							} else {
								readData.ProjectId = -1;
							}
							readData.MdcControllingUnitFks = parentService.getMdcIds();
							readData.DueDate = parentService.getSelectedDueDate()? parentService.getSelectedDueDate():null;
							return readData;
						}
					},
					entityRole: {
						leaf: {itemName: 'PesHeaderDto', parentService: parentService}
					},
					actions: {},
					entitySelection: {supportsMultiSelection: true},
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
			basicsLookupdataLookupDescriptorService.loadData('PesStatus');

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
