/**
 * Created by wuj on 9/2/2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.procurementconfiguration';
	angular.module(moduleName)
		.factory('basicsProcurementConfiguration2TextTypeDataService',
			['_', '$http','platformDataServiceFactory', 'basicsProcurementConfigHeaderDataService', 'basicsLookupdataLookupFilterService','platformContextService', 'basicsProcurementConfigurationDataService',
				'basicsLookupdataLookupDescriptorService', 'platformRuntimeDataService', 'basicsProcurementConfigurationRubricCategoryService', 'basicsCommonMandatoryProcessor',
				function (_, $http,dataServiceFactory, headerService, basicsLookupdataLookupFilterService,platformContextService, parentService,
					basicsLookupdataLookupDescriptorService, platformRuntimeDataService, ConfigurationRubricCategoryService, basicsCommonMandatoryProcessor) {

					var filters = [
						{
							key: 'basics-procurement-configuration-header-text-filter',
							serverSide: true,
							fn: function () {
								return 'ForHeader = true';    //'CompanyFk = ' + loginCompany +loginCompany = platformContextService.clientId,
							}
						},
						{
							key: 'basics-procurement-configuration-item-text-filter',
							serverSide: true,
							fn: function () {
								return 'ForItem = true';
							}
						},
						{
							key: 'basics-procurement-configuration-text-textmoudletype-filter',
							serverSide: true,
							fn: function () {
								//return 'Islive = true && order by Sorting';
							}
						},
						{
							key: 'basics-procurement-configuration-text-textmoudle-filter',
							serverSide: true,
							serverKey: 'basics-procurement-configuration-text-textmoudle-filter',
							fn: function(item){
								var rubric = ConfigurationRubricCategoryService.getSelected();
								var rubricFk = null;
								if(rubric){
									rubricFk = rubric.Id > 0 ? rubric.Id : rubric.Id * -1;
								}
								var basTextModuleTypeFk=item.BasTextModuleTypeFk;
								return {
									RubricFk: rubricFk,
									BasTextModuleTypeFk:basTextModuleTypeFk
								};
							}
						}
					];

					basicsLookupdataLookupFilterService.registerFilter(filters);

					function createService(forHeader, options) {
						if (!options) {
							throw new Error('argument, options, should not be null for function basicsProcurementConfiguration2TextTypeDataService.createService.');
						}

						var serviceOptions = {
							flatLeafItem: {
								module: angular.module(moduleName),
								serviceName: options.serviceName,
								httpCRUD: {
									route: globals.webApiBaseUrl + 'basics/procurementconfiguration/' + (forHeader? 'configuration2texttype': 'configuration2texttypeitem') + '/',
									initReadData: function (readData) {
										var parentItem = parentService.getSelected();
										readData.filter = '?mainItemId=' + parentItem.Id;
									}
								},
								presenter: {
									list: {
										initCreationData: function initCreationData(creationData) {
											var configHeader = headerService.getSelected();
											var config = parentService.getSelected();
											if (configHeader && config) {
												creationData.headerId = configHeader.Id;
												creationData.mainItemId = config.Id;
											}

											creationData.forHeader = forHeader;
										},
										incorporateDataRead: function incorporateDataRead(list, data){
											return serviceContainer.data.handleReadSucceeded(list, data);
										}
									}
								},
								entityRole: {
									leaf: {
										itemName: forHeader? 'PrcConfiguration2TextType': 'PrcConfiguration2TextTypeItem',
										parentService: parentService
									}
								}
							}
						};

						var serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);
						var service = serviceContainer.service;
						var onEntityCreated = function onEntityCreated(e, newItem) {
							var defaultItem = _.find(service.getList(), {
								PrcTextTypeFk: newItem.PrcTextTypeFk
							});
							if (defaultItem.Id !== newItem.Id) {
								newItem.PrcTextTypeFk = null;
							}
						};

						service.registerEntityCreated(onEntityCreated);

						serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
							typeName: options.typeName,
							moduleSubModule: 'Basics.ProcurementConfiguration',
							validationService: options.validationService,
							mustValidateFields: ['PrcTextTypeFk']
						});

						return service;

					}

					return {createService: createService};
				}])
		.factory('basicsProcurementConfiguration2HeaderTextDataService',
			['basicsProcurementConfiguration2TextTypeDataService',
				function (dataServiceFactory) {
					return dataServiceFactory.createService(true, {
						serviceName: 'basicsProcurementConfiguration2HeaderTextDataService',
						typeName: 'PrcConfiguration2TextTypeDto',
						validationService: 'basicsProcurementConfiguration2HeaderTextValidationService'
					});
				}])
		.factory('basicsProcurementConfiguration2ItemTextDataService',
			['basicsProcurementConfiguration2TextTypeDataService',
				function (dataServiceFactory) {
					return dataServiceFactory.createService(false, {
						serviceName: 'basicsProcurementConfiguration2ItemTextDataService',
						typeName: 'PrcConfiguration2TextTypeItemDto',
						validationService: 'basicsProcurementConfiguration2ItemTextValidationService'
					});
				}]);
})(angular);