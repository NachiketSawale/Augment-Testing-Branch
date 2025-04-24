
(function (){
	'use strict';
	let module = angular.module('controlling.generalcontractor');

	module.factory('controllingGeneralActualDataService',['_','globals','platformDataServiceFactory', 'controllingGeneralcontractorCostControlDataService', 'cloudDesktopPinningContextService','$injector',
		function (_,globals,platformDataServiceFactory,controllingGeneralcontractorCostControlDataService, cloudDesktopPinningContextService,$injector) {
			let serviceContainer = {};

			let serviceOptions = {
				flatLeafItem: {
					module: module,
					serviceName: 'controllingGeneralActualDataService',
					entityNameTranslationID: 'controlling.generalcontractor.GeneralContractorControlling',
					httpRead: {
						route: globals.webApiBaseUrl + 'Controlling/GeneralContractor/GCActualsController/', // adapt to web API controller
						endRead: 'getActuals',
						usePostForRead: true,
						initReadData: function (readData) {
							let projectContext = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
							if(projectContext){
								readData.ProjectId = projectContext.id;
							} else {
								readData.ProjectId = -1;
							}
							readData.MdcControllingUnitFks = controllingGeneralcontractorCostControlDataService.getMdcIds();
							readData.PageSize = 30;
							readData.DueDate = controllingGeneralcontractorCostControlDataService.getSelectedDueDate()? controllingGeneralcontractorCostControlDataService.getSelectedDueDate():null;
							return readData;
						}
					},
					entityRole: {
						leaf: {itemName: 'GeneralContractorActuals', parentService: controllingGeneralcontractorCostControlDataService}
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

			let service =  serviceContainer.service;

			service.isKeepSearchPanel = true;
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
				readData.MdcControllingUnitFks = controllingGeneralcontractorCostControlDataService.getMdcIds();
				readData.PageSize = 30;
				return readData;
			};

			serviceContainer.data.markItemAsModified = angular.noop;
			serviceContainer.service.markItemAsModified = angular.noop;

			return service;
		}
	]);
})();