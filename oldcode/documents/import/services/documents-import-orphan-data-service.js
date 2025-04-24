(function (angular) {
	'use strict';

	var moduleName = 'documents.import';
	angular.module(moduleName)
		.factory('documentImportDataService',
			['globals','$http', 'platformDataServiceFactory','documentsImportWizardImportService',
				function (globals,$http, dataServiceFactory,documentsImportWizardImportService) {

					var sidebarSearchOptions = {
						moduleName: moduleName,  // required for filter initialization
						enhancedSearchEnabled: true,
						pattern: '',
						pageSize: 100,
						useCurrentClient: null,
						includeNonActiveItems: null,
						includeChainedItems: true,
						showOptions: false,
						showProjectContext: false,
						withExecutionHints: false
					};
					var serviceContainer = null;
					var serviceOptions = {
						flatRootItem: {
							module: angular.module(moduleName),
							httpCRUD: {
								route: globals.webApiBaseUrl + 'documents/documentsimport/',
								usePostForRead: true
							},
							entityRole: {
								root: {
									itemName: 'Documentorphan',
									moduleName: 'cloud.desktop.moduleDisplayNameDocumentImport',
									descField: 'DescriptionInfo.Translated'
								}
							},
							presenter: {
								list: {
									incorporateDataRead: function(readData,data){
										var result = {
											FilterResult: readData.FilterResult,
											dtos: readData.Main || []
										};

										return serviceContainer.data.handleReadSucceeded(result, data);
									}
								}
							},
							sidebarSearch: {options: sidebarSearchOptions},
							actions: {
								delete: false,
								create: false
							}
						}
					};
					serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);
					var service = serviceContainer.service;

					service.disableAssignment = function () {
						return service.getList().length === 0;
					};

					service.assignment = function () {
						var orphanDtos = service.getList();
						if(orphanDtos.length){
							$http.post(globals.webApiBaseUrl + 'documents/documentsimport/reimport',orphanDtos).then(
								function (res) {
									if(res && res.data){
										documentsImportWizardImportService.importTaskCreateComplete.fire(res.data);
									}
									service.gridRefresh();
								}
							);
						}
					};

					service.parentServiceHasSelected = function(){
						return service.getList().length > 0;
					};

					return service;
				}]);
})(angular);