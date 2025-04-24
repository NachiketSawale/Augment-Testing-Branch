/**
 * Created by lvy on 4/17/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.procurementconfiguration';
	// jshint -W072
	angular.module(moduleName).factory('basicsPrcConfigRfqCoverLetterOrEamilBodyService',
		['$q','$injector','platformDataServiceFactory', 'basicsProcurementConfigHeaderDataService', 'basicsProcurementConfigurationRubricCategoryService', 'basicsProcurementConfigurationDataService', 'basicsCommonMandatoryProcessor', 'basicsProcurementConfigurationRfqReportsValidationService','platformObjectHelper',
			function ($q,$injector,dataServiceFactory, headerService, rubricCategoryService, parentService, mandatoryProcessor, commonValidationService,platformObjectHelper) {
				var serviceOptions = {
					flatLeafItem: {
						serviceName: 'basicsPrcConfigRfqCoverLetterOrEamilBodyService',
						entityNameTranslationID: 'basics.procurementconfiguration.rfqCoverLetterOrEamilBody',
						module: angular.module(moduleName),
						httpCRUD: {
							route: globals.webApiBaseUrl + 'basics/procurementconfiguration/configuration2report/',
							endRead: 'list',
							initReadData: function initReadData(readData) {
								var parentSelectedId = parentService.getSelected().Id;
								var contextFk = (parentSelectedId === null || parentSelectedId === undefined) ? -1 : parentSelectedId;
								readData.filter = '?mainItemId=' + contextFk + '&reportType=1';
							}
						},
						presenter: {
							list: {
								incorporateDataRead: function (readData, data){
									return data.handleReadSucceeded(readData ? readData : [], data);
									// return itemList;
								},
								initCreationData: function initCreationData(creationData) {
									var configHeader = headerService.getSelected();
									var config = parentService.getSelected();
									if (configHeader && config) {
										creationData.reportType = 1;
										creationData.mainItemId = config.Id;
									}
								}
							}
						},
						entityRole: {
							leaf: {
								itemName: 'PrcConfig2Report',
								parentService: parentService,
								doesRequireLoadAlways:true
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
					typeName: 'PrcConfig2ReportDto',
					moduleSubModule: 'Basics.ProcurementConfiguration',
					validationService: commonValidationService(serviceContainer.service),
					mustValidateFields:['BasReportFk']
				});

				return serviceContainer.service;
			}]);
})(angular, jQuery);
