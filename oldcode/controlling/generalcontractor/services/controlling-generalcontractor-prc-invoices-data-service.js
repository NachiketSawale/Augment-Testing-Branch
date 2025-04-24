
(function (){
	'use strict';
	let module = angular.module('controlling.generalcontractor');

	module.factory('controllingGeneralPrcInvoicesDataService',['_','globals','platformDataServiceFactory', 'controllingGeneralcontractorCostControlDataService', 'cloudDesktopPinningContextService','platformGridAPI',
		function (_,globals,platformDataServiceFactory,parentService,cloudDesktopPinningContextService,platformGridAPI) {
			let serviceContainer ={};
			let documentProjectGridId = '4eaa47c530984b87853c6f2e4e4fc67e';
			let isCancelledInvoices =false;

			let serviceOptions = {
				flatLeafItem: {
					module: module,
					serviceName: 'controllingGeneralPrcInvoicesDataService',
					entityNameTranslationID: 'controlling.generalcontractor.GeneralContractorControlling',
					httpRead: {
						route: globals.webApiBaseUrl + 'Controlling/GeneralContractor/GCPrcInvoicesController/', // adapt to web API controller
						endRead: 'getPrcInvoiceList',
						usePostForRead: true,
						initReadData: function (readData) {
							let projectContext = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
							if(projectContext){
								readData.ProjectId = projectContext.id;
							} else {
								readData.ProjectId = -1;
							}
							readData.IsCancelledInvoices =isCancelledInvoices;
							readData.MdcControllingUnitFks = parentService.getMdcIds();
							readData.DueDate = parentService.getSelectedDueDate()? parentService.getSelectedDueDate():null;
							return readData;
						}
					},
					entityRole: {
						leaf: {itemName: 'GeneralPrcInvoices', parentService: parentService}
					},
					actions: {},
					entitySelection: {supportsMultiSelection: true},
				}
			};

			serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

			serviceContainer.service.refreshData = function () {
				if(!parentService.getSelected()){
					serviceContainer.service.setList([]);
					serviceContainer.data.itemList =[];
					serviceContainer.service.gridRefresh();
				}
			};

			serviceContainer.service.isLoadDocumentProject = function () {
				return platformGridAPI.grids.exist(documentProjectGridId);
			};

			serviceContainer.service.filterOutCancelledInvoices = function filterOutCancelledInvoices(isCancelled){
				let projectContext = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
				if(!projectContext){
					return;
				}
				isCancelledInvoices = isCancelled;
				serviceContainer.service.load();
			};

			return serviceContainer.service;
		}
	]);
})();