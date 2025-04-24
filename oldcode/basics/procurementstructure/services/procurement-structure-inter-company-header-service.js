/**
 * Created by jie on 03/24/2023.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.procurementstructure';
	angular.module(moduleName)
		.factory('basicsInterCompanyHeaderConfigHeaderDataService',
			['$injector',
				'platformDataServiceFactory', 'PlatformMessenger', 'platformDataServiceDataProcessorExtension',
				'platformDataServiceActionExtension', 'platformDataServiceSelectionExtension',
				'platformModalService', 'platformDataValidationService',
				'platformModuleStateService','basicsProcurementStructureService',
				function ($injector, dataServiceFactory, PlatformMessenger, platformDataServiceDataProcessorExtension,
					platformDataServiceActionExtension, platformDataServiceSelectionExtension, platformModalService, platformDataValidationService,
					platformModuleStateService,basicsProcurementStructureService) {


					var serviceOptions = {
						flatNodeItem: {
							module: angular.module(moduleName),
							httpCRUD: {
								route: globals.webApiBaseUrl + 'basics/procurementstructure/intercompany/',
								endRead: 'getContextByCompanyId',
								usePostForRead: false,
								initReadData: function initReadData(readData) {
									var selected = basicsProcurementStructureService.getSelected();
									readData.PKey1 = selected.Id;
								}
							},
							entityRole: {
								node: {
									itemName: 'MdcContext',
									moduleName: 'basics.procurementstructure',
									descField: 'DescriptionTranslateType.Description',
									parentService: basicsProcurementStructureService
								}
							},
							presenter: {
								list: {
									initCreationData: function initNumberCreationData(creationData) {
										var selected = basicsProcurementStructureService.getSelected();
										creationData.PKey1 = selected.Id;
									}
								}
							}
						}
					};

					var serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);

					var service = serviceContainer.service;
					return service;
				}]);
})(angular);