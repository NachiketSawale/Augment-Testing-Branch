/**
 * Created by pel on 3/22/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.procurementconfiguration';
	// jshint -W072
	/* global angular */
	/* global globals */
	angular.module(moduleName).factory('basicsProcurementConfigurationRfqDocumentsService',
		['$q', '$injector', 'platformDataServiceFactory', 'basicsProcurementConfigHeaderDataService', 'basicsProcurementConfigurationRubricCategoryService', 'basicsProcurementConfigurationDataService',
			'basicsLookupdataLookupFilterService', 'basicsCommonMandatoryProcessor', 'platformRuntimeDataService', 'basicsLookupdataLookupDescriptorService',
			function ($q, $injector, dataServiceFactory, headerService, rubricCategoryService, parentService, basicsLookupdataLookupFilterService, mandatoryProcessor,
					  platformRuntimeDataService, basicsLookupdataLookupDescriptorService) {
				var serviceOptions = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'basicsProcurementConfigurationRfqDocumentsService',
						entityNameTranslationID: 'basics.procurementconfiguration.rfqdocuments',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'basics/procurementconfiguration/configuration2document/',
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
									var itemList = data.handleReadSucceeded(readData ? readData : [], data);
									for (var i = 0; i < itemList.length; ++i) {
										setItemReadonly(itemList[i]);
									}
									return itemList;
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
								itemName: 'PrcConfig2Document',
								parentService: parentService,
								doesRequireLoadAlways: true
							}
						}
					}
				};
				var serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);

				basicsLookupdataLookupDescriptorService.loadData('prcdocumenttype');
				basicsLookupdataLookupDescriptorService.loadData('clerkDocumenttype');
				basicsLookupdataLookupDescriptorService.loadData('prjdocumenttype');
				basicsLookupdataLookupDescriptorService.loadData('slsdocumenttype');

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

				var filters = [
					{
						key: 'rfq-rubric-filter',
						serverSide: true,
						fn: function () {
							return 'Id =3 or Id=80 or Id=23 or Id=24 or Id=25 or Id=26 or Id=27 or Id=28 or Id=31 or Id=4 or Id=7 or Id=5 or Id=17 or Id=106';
						}
					}
				];

				serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
					typeName: 'PrcConfig2documentDto',
					moduleSubModule: 'Basics.ProcurementConfiguration',
					validationService: 'basicsProcurementConfigurationRfqDocumentsValidationService',
					mustValidateFields: ['BasRubricFk']
				});
				//register filter by hand
				serviceContainer.service.registerFilters = function registerFilters() {
					basicsLookupdataLookupFilterService.registerFilter(filters);

				};

				//unload filters
				serviceContainer.service.unregisterFilters = function () {
					basicsLookupdataLookupFilterService.unregisterFilter(filters);

				};

				var procurement_rubricCategoryList = [23, 24, 25, 26, 27, 28, 31,106];//
				var sales_rubricCategoryList = [4, 5, 7, 17];//
				var project_rubricCategoryList = [3];//
				var clerk_rubricCategoryList = [80];//

				function setItemReadonly(entity) {
					var value = entity.BasRubricFk;
					if (clerk_rubricCategoryList.indexOf(value) > -1)// it is clerk
					{
						// set other readonly
						setReadonly(entity, false, true, true, true);
					} else if (procurement_rubricCategoryList.indexOf(value) > -1) {// it is procurement
						// set other readonly
						setReadonly(entity, true, false, true, true);
					} else if (project_rubricCategoryList.indexOf(value) > -1)// it is project
					{
						// set other readonly
						setReadonly(entity, true, true, false, true);
					} else if (sales_rubricCategoryList.indexOf(value) > -1)// it is sales
					{
						// set other readonly
						setReadonly(entity, true, true, true, false);
					}
				}

				function setReadonly(entity, clerk_Readonly, prc_Readonly, prj_Readonly, sales_Readonly) {
					if (clerk_Readonly) {
						platformRuntimeDataService.readonly(entity, [{field: 'BasClerkdocumenttypeFk', readonly: true}]);
						entity.BasClerkdocumenttypeFk = null;
					}
					if (prc_Readonly) {
						platformRuntimeDataService.readonly(entity, [{field: 'PrcDocumenttypeFk', readonly: true}]);
						entity.PrcDocumenttypeFk = null;
					}
					if (prj_Readonly) {
						platformRuntimeDataService.readonly(entity, [{field: 'PrjDocumenttypeFk', readonly: true}]);
						entity.PrjDocumenttypeFk = null;
					}
					if (sales_Readonly) {
						platformRuntimeDataService.readonly(entity, [{field: 'SlsDocumenttypeFk', readonly: true}]);
						entity.SlsDocumenttypeFk = null;
					}
					if (!clerk_Readonly) {
						platformRuntimeDataService.readonly(entity, [{field: 'BasClerkdocumenttypeFk', readonly: false}]);
					}
					if (!prc_Readonly) {
						platformRuntimeDataService.readonly(entity, [{field: 'PrcDocumenttypeFk', readonly: false}]);
					}
					if (!prj_Readonly) {
						platformRuntimeDataService.readonly(entity, [{field: 'PrjDocumenttypeFk', readonly: false}]);
					}
					if (!sales_Readonly) {
						platformRuntimeDataService.readonly(entity, [{field: 'SlsDocumenttypeFk', readonly: false}]);
					}
				}

				serviceContainer.service.registerFilters();
				serviceContainer.service.registerFilters();
				return serviceContainer.service;
			}]);
})(angular);

