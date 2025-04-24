(function (angular) {
	'use strict';

	var moduleName = 'basics.procurementconfiguration';
	// jshint -W072
	angular.module(moduleName).factory('basicsProcurementConfigurationDataFormatService',
		['$q','$injector', 'platformDataServiceFactory', 'basicsProcurementConfigHeaderDataService', 'basicsProcurementConfigurationRubricCategoryService', 'basicsProcurementConfigurationDataService', 'basicsCommonMandatoryProcessor',
			function ($q,$injector, dataServiceFactory, headerService, rubricCategoryService, parentService, mandatoryProcessor) {
				var serviceOptions = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'basicsProcurementConfigurationDataFormatService',
						entityNameTranslationID: 'basics.procurementconfiguration.rfqDataFormat',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'basics/procurementconfiguration/configuration2dataformat/',
							endRead: 'list',
							initReadData: function initReadData(readData) {
								var parentSelectedId = parentService.getSelected().Id;
								var contextFk = (parentSelectedId === null || parentSelectedId === undefined) ? -1 : parentSelectedId;
								readData.filter = '?mainItemId=' + contextFk;
							}
						},
						presenter: {
							list: {
								incorporateDataRead: function (readData, data) {
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
								itemName: 'PrcConfig2dataformat',
								parentService: parentService,
								doesRequireLoadAlways: true
							}
						}
					}
				};
				var serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);

				var basReadData = serviceContainer.data.doReadData;
				serviceContainer.data.doReadData = function doReadData() {
					var rubricCategory = rubricCategoryService.getSelected();
					if (rubricCategory) {
						return basReadData(serviceContainer.data);
					} else {
						return $q.when([]);
					}
				};

				var canCreate = serviceContainer.service.canCreate;
				serviceContainer.service.canCreate = function () {
					var rubricCategory = rubricCategoryService.getSelected();
					if (rubricCategory) {
						return canCreate();
					}
					return false;
				};
				var canDelete = serviceContainer.service.canDelete;
				serviceContainer.service.canDelete = function () {
					var rubricCategory = rubricCategoryService.getSelected();
					if (rubricCategory) {
						return canDelete();
					}
					return false;
				};

				serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
					typeName: 'PrcConfig2dataformatDto',
					moduleSubModule: 'Basics.ProcurementConfiguration',
					validationService: 'basicsProcurementConfigurationRfqDataFormatValidationService',
					mustValidateFields: ['BasDataformatFk']
				});

				return serviceContainer.service;
			}]);
})(angular);
