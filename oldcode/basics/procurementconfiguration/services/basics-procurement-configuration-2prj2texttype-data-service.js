(function (angular) {
	'use strict';

	var moduleName = 'basics.procurementconfiguration';
	// jshint -W072
	angular.module(moduleName).factory('basicsProcurementConfiguration2Prj2TextTypeService',
		['$injector','platformDataServiceFactory', 'basicsProcurementConfigHeaderDataService', 'basicsLookupdataLookupDescriptorService','basicsCommonMandatoryProcessor', 'basicsProcurementConfigurationDataService',
			function ($injector,dataServiceFactory, headerService, lookupDescriptorService,basicsCommonMandatoryProcessor, parentService) {
				var serviceOptions = {
					flatLeafItem: {
						module: angular.module(moduleName),
						httpCRUD: {
							route: globals.webApiBaseUrl + 'basics/procurementconfiguration/configuration2prj2texttype/',
							endRead: 'list',
							initReadData: function initReadData(readData) {
								var parentSelectedId = parentService.getSelected().Id;
								var contextFk = (parentSelectedId === null || parentSelectedId === undefined) ? -1 : parentSelectedId;
								readData.filter = '?mainItemId=' + contextFk;
							}
						},
						presenter: {
							list: {
								incorporateDataRead: function (readData, data){
									return data.handleReadSucceeded(readData ? readData : [], data);
									//return itemList;
								},
								initCreationData: function initCreationData(creationData) {
									var configHeader = headerService.getSelected();
									var config = parentService.getSelected();
									if (configHeader && config) {
										creationData.headerId = configHeader.Id;
										creationData.mainItemId = config.Id;
									}
								}
							}
						},
						entityRole: {
							leaf: {
								itemName: 'PrcConfiguration2Prj2TextType',
								parentService: parentService,
								doesRequireLoadAlways:true
							}
						}
					}
				};
				var serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);
				serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					typeName: 'PrcConfiguration2Prj2TextTypeDto',
					moduleSubModule: 'Basics.ProcurementConfiguration',
					validationService: 'basicsProcurementConfiguration2Prj2HeaderTextValidationService',
					mustValidateFields: ['PrjProjectFk', 'PrcTexttypeFk','BasTextModuleFk']
				});
				return serviceContainer.service;
			}]);
})(angular, jQuery);
