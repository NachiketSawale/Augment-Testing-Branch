
(function (angular){
	'use strict';

	let moduleName = 'controlling.generalcontractor';
	angular.module(moduleName).controller('controllingGeneralPRCInvoicesListController',
		['$scope', '_', '$timeout','platformGridControllerService', '$injector', 'controllingGeneralPrcInvoicesDataService', 'controllingGeneralPrcInvoiceConfigurationService',
			function ($scope,_,$timeout,platformGridControllerService,$injector,controllingGeneralPrcInvoicesDataService,controllingGeneralPrcInvoiceConfigurationService) {
				let myGridConfig = {
					initCalled: false,
					column:[],
					sortOption: {
						initialSortColumn:{field: 'code', id: 'code'},
						isAsc: true
					},
					cellChangeCallBack: function cellChangeCallBack() {

					},
					rowChangeCallBack: function rowChangeCallBack () {
						if(controllingGeneralPrcInvoicesDataService.isLoadDocumentProject()){
							let documentsProjectDocumentDataService = $injector.get('documentsProjectDocumentDataService');
							let config = $injector.get('documentsProjectDocumentModuleContext').getConfig();
							let documentDataService = documentsProjectDocumentDataService.getService(config);
							documentDataService.getServiceContainer().data.doReadData(documentDataService.getServiceContainer().data);
						}
					}
				};

				platformGridControllerService.initListController($scope, controllingGeneralPrcInvoiceConfigurationService, controllingGeneralPrcInvoicesDataService, null, myGridConfig);

				let controllerFeaturesServiceProvider = $injector.get ('controllingGeneralcontractorControllerFeaturesServiceProvider');
				controllerFeaturesServiceProvider.extendControllerByIsProjectContextService($scope);


				controllingGeneralPrcInvoicesDataService.refreshData();



				function updateTools() {
					let tools = [{
						id: 'cancelledInvoices',
						caption: 'Cancelled Invoices',
						type: 'check',
						iconClass: 'tlb-icons ico-filter-cancelled-invoices',
						caption$tr$: 'controlling.generalcontractor.cancelledInvoices',
						fn: function () {
							controllingGeneralPrcInvoicesDataService.filterOutCancelledInvoices(this.value);
						},
						sort:1
					}];

					$scope.addTools(tools);
					$scope.tools.items = _.orderBy($scope.tools.items,'sort');
					$scope.tools.update();
				}

				updateTools();
			}
		]);
})(angular);