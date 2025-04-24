(function (angular) {
	'use strict';

	var moduleName = 'basics.procurementstructure';
	angular.module(moduleName)
		.factory('basicsProcurement2EvaluationService',
			['platformDataServiceFactory', 'basicsProcurementStructureService',
				'basicsLookupdataLookupDescriptorService', 'basicsLookupdataLookupFilterService',
				function (dataServiceFactory, parentService, basicsLookupdataLookupDescriptorService, basicsLookupdataLookupFilterService) {

					var serviceOption = {
						flatLeafItem: {
							module: angular.module(moduleName),
							httpCreate: {route: globals.webApiBaseUrl + 'basics/procurementstructure/evaluation/'},
							httpRead: {route: globals.webApiBaseUrl + 'basics/procurementstructure/evaluation/'},
							presenter: {
								list: {
									incorporateDataRead: incorporateDataRead,
									initCreationData: initCreationData
								}
							},
							entityRole: {
								leaf: {
									itemName: 'PrcStructure2Evaluation',
									parentService: parentService
								}
							}
						}
					};

					var serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
					var service = serviceContainer.service;

					var responsibleCompanyFilter = {
						key: 'procurement-structure-clerk-company-filter',
						serverSide: true,
						fn: function () {
							var select = service.getSelected();
							if (select && angular.isDefined(select.Id)) {
								return ' CompanyFk=' + select.CompanyFk;
							}
							return 'Id=-1';
						}
					};
					basicsLookupdataLookupFilterService.registerFilter(responsibleCompanyFilter);

					return service;

					function incorporateDataRead(readData, data) {
						basicsLookupdataLookupDescriptorService.attachData(readData);

						return serviceContainer.data.handleReadSucceeded(readData.Main, data);
					}

					function initCreationData(creationData) {
						creationData.PKey1 = parentService.getSelected().Id;
					}

				}]);
})(angular);