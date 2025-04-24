
(function () {
	/* global globals */
	'use strict';
	let module = angular.module('controlling.generalcontractor');

	module.factory('controllingGeneralContractorPackagesDataService', ['_', 'platformDataServiceFactory','controllingGeneralcontractorCostControlDataService','cloudDesktopPinningContextService',
		function (_,platformDataServiceFactory,parentService,cloudDesktopPinningContextService) {

			let serviceOptions = {
				flatLeafItem: {
					module: module,
					serviceName: 'controllingGeneralContractorPackagesDataService',
					entityNameTranslationID: 'controlling.generalcontractor.GeneralContractorControlling',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'Controlling/GeneralContractor/CostControlController/', // adapt to web API controller
						endRead: 'getPrcPackagesByCondition',
						usePostForRead: true,
						initReadData: function (readData) {
							let context = cloudDesktopPinningContextService.getContext();
							let item =_.find(context, {'token': 'project.main'});
							readData.ProjectId = item ? item.id: -1;
							readData.MdcControllingUnitFks = parentService.getMdcIds();

							let costControlSelected = parentService.getSelected();
							readData.IsControllingRoot = costControlSelected ? !costControlSelected.MdcControllingUnitFk:false;
							readData.DueDate = parentService.getSelectedDueDate()? parentService.getSelectedDueDate():null;
							return readData;
						}
					},
					actions: {},
					entityRole: {
						leaf: {itemName: 'Packages', parentService: parentService}
					},
					entitySelection: {supportsMultiSelection: true},
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
			let service = serviceContainer.service;

			service.refreshData = function () {
				if(!parentService.getSelected()){
					service.setList([]);
					serviceContainer.data.itemList =[];
					service.gridRefresh();
				}
			};

			return service;
		}]);
})();
