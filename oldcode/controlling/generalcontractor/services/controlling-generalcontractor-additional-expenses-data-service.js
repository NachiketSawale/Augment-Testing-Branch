
(function (){
	'use strict';
	let module = angular.module('controlling.generalcontractor');

	module.factory('controllingGeneralContractorAdditionalExpensesDataService',['_', 'globals', '$injector','platformDataServiceFactory', 'controllingGeneralcontractorCostControlDataService','cloudDesktopPinningContextService',
		function (_,globals,$injector,platformDataServiceFactory,controllingGeneralcontractorCostControlDataService,cloudDesktopPinningContextService) {
			let serviceContainer = {};

			let serviceOptions = {
				flatLeafItem: {
					module: module,
					serviceName: 'controllingGeneralContractorAdditionalExpensesDataService',
					entityNameTranslationID: 'controlling.generalcontractor.GeneralContractorControlling',
					httpRead: {
						route: globals.webApiBaseUrl + 'Controlling/GeneralContractor/GCAdditionalExpensesController/', // adapt to web API controller
						endRead: 'getAdditionalList',
						usePostForRead: true,
						initReadData: function (readData) {
							let projectContext = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
							if(projectContext){
								readData.ProjectId = projectContext.id;
							} else {
								readData.ProjectId = -1;
							}
							readData.MdcControllingUnitFks =controllingGeneralcontractorCostControlDataService.getMdcIds();
							readData.PageSize = 30;
							readData.DueDate = controllingGeneralcontractorCostControlDataService.getSelectedDueDate()? controllingGeneralcontractorCostControlDataService.getSelectedDueDate():null;
							return readData;
						}
					},
					entityRole: {
						leaf: {itemName: 'GeneralContractorAdditionalExpenses', parentService: controllingGeneralcontractorCostControlDataService}
					},
					presenter: {
						list: {
							incorporateDataRead:function (responseData, data) {
								if(!responseData){
									return null;
								}

								data.handleReadSucceeded(responseData.dtos, data);
								return responseData;
							}
						}
					},
					actions: {},
					entitySelection: {supportsMultiSelection: true},
				}
			};

			serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

			let estimateCommonPaginationService = $injector.get('estimateCommonPaginationService');
			estimateCommonPaginationService.extendPaginationService(serviceContainer);

			let service = serviceContainer.service;

			service.refreshData = function () {
				if(!controllingGeneralcontractorCostControlDataService.getSelected()){
					service.setList([]);
					serviceContainer.data.itemList =[];
					service.gridRefresh();
				}
			};
			serviceContainer.service.getFilterCondition = function getFilterCondition(){
				let readData ={};
				let projectContext = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
				if(projectContext){
					readData.ProjectId = projectContext.id;
				} else {
					readData.ProjectId = -1;
				}
				readData.MdcControllingUnitFks =controllingGeneralcontractorCostControlDataService.getMdcIds();
				readData.PageSize = 30;
				return readData;
			};

			serviceContainer.data.markItemAsModified = angular.noop;
			serviceContainer.service.markItemAsModified = angular.noop;

			return service;
		}
	]);
})();