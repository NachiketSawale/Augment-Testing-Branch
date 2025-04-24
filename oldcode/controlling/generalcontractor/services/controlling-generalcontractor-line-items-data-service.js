
(function () {
	/* global _  */
	'use strict';
	let module = angular.module('controlling.generalcontractor');

	module.factory('controllingGeneralContractorLineItemsDataService', [ 'platformDataServiceFactory','$injector','controllingGeneralcontractorCostControlDataService','cloudDesktopPinningContextService',
		function (platformDataServiceFactory,$injector,parentService,cloudDesktopPinningContextService) {

			let serviceOptions = {
				flatLeafItem: {
					module: module,
					serviceName: 'controllingGeneralContractorLineItemsDataService',
					entityNameTranslationID: 'controlling.generalcontractor.GeneralContractorControlling',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'estimate/main/lineitem/', // adapt to web API controller
						endRead: 'getLineItemByCondition',
						usePostForRead: true,
						initReadData: function (readData) {
							let projectContext = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
							if(projectContext){
								readData.ProjectId = projectContext.id;
							} else {
								readData.ProjectId = -1;
							}
							readData.MdcControllingUnitFks = parentService.getMdcIds();
							readData.PageSize = 30;
							readData.DueDate = parentService.getSelectedDueDate()? parentService.getSelectedDueDate():null;
							return readData;
						}
					},
					entityRole: {
						leaf: {itemName: 'GeneralContractorLineItems', parentService: parentService}
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
					// modification: {simple: {}},
					entitySelection: {supportsMultiSelection: true},
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

			let estimateCommonPaginationService = $injector.get('estimateCommonPaginationService');
			estimateCommonPaginationService.extendPaginationService(serviceContainer);

			serviceContainer.service.refreshData = function () {
				if(!parentService.getSelected()){
					serviceContainer.service.setList([]);
					serviceContainer.data.itemList =[];
					serviceContainer.service.gridRefresh();
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
				readData.MdcControllingUnitFks = parentService.getMdcIds();
				readData.PageSize = 30;
				return readData;
			};

			serviceContainer.data.markItemAsModified = angular.noop;
			serviceContainer.service.markItemAsModified = angular.noop;

			return serviceContainer.service;
		}]);
})();
