(function (angular){
	'use strict';

	let module = angular.module('controlling.generalcontractor');

	module.factory('controllingGeneralContractorBudgetShiftDataService', ['globals', 'platformDataServiceFactory','controllingGeneralcontractorCostControlDataService',
		function (globals, platformDataServiceFactory,parentService) {

			let serviceOptions = {
				flatLeafItem: {
					module: module,
					serviceName: 'controllingGeneralContractorBudgetShiftDataService',
					entityNameTranslationID: 'controlling.generalcontractor.GeneralContractorControlling',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'controlling/generalcontractor/budgetshiftcontroller/', // adapt to web API controller
						endRead: 'getbudgetshiftlist',
						usePostForRead: true,
						initReadData: function (readData) {
							let costControlSelected = parentService.getSelected();
							if(costControlSelected){
								readData.MdcControllingUnitFk = Math.abs(costControlSelected.Id);
								readData.DueDate = parentService.getSelectedDueDate()? parentService.getSelectedDueDate():null;
							}
							return readData;
						}
					},
					entityRole: {
						leaf: {itemName: 'GeneralContractorBudgetShift', parentService: parentService}
					},
					actions: {},
					entitySelection: {supportsMultiSelection: true},
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

			serviceContainer.service.refreshData = function () {
				if(!parentService.getSelected()){
					serviceContainer.service.setList([]);
					serviceContainer.data.itemList =[];
					serviceContainer.service.gridRefresh();
				}
			};

			return serviceContainer.service;
		}]);
})(angular);