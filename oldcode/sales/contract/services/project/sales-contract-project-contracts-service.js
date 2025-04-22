/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals */

(function () {
	'use strict';
	var moduleName = 'sales.contract';
	var salesContractModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name salesContractService
	 * @function
	 *
	 * @description
	 * salesContractProjectContractsService is the data service for project contracts Header functionality.
	 */
	salesContractModule.factory('salesContractProjectContractsService', ['_', '$translate', 'platformDataServiceFactory', 'projectMainService', 'salesContractCreateContractDialogService', 'ServiceDataProcessDatesExtension', 'SalesContractDocumentTypeProcessor','basicsCommonMandatoryProcessor',
		function (_, $translate, platformDataServiceFactory, projectMainService, salesContractCreateContractDialogService, ServiceDataProcessDatesExtension, SalesContractDocumentTypeProcessor,basicsCommonMandatoryProcessor) {

			// The instance of the main service - to be filled with functionality below
			var salesContractHeaderServiceOptions = {
				flatLeafItem: {
					module: salesContractModule,
					serviceName: 'salesContractService',
					httpCreate: {route: globals.webApiBaseUrl + 'sales/contract/'},
					httpRead: {route: globals.webApiBaseUrl + 'sales/contract/'},
					entityRole: {
						leaf: {
							itemName: 'OrdHeader',
							moduleName: 'Sales Contract',
							parentService: projectMainService,
							parentFilter: 'projectId'
						}
					},
					entitySelection: {},
					dataProcessor: [new ServiceDataProcessDatesExtension([
						'OrderDate', 'PlannedStart', 'PlannedEnd', 'DateEffective', 'WipFirst', 'WipFrom', 'WipUntil',
						'UserDefinedDate01', 'UserDefinedDate02', 'UserDefinedDate03', 'UserDefinedDate04', 'UserDefinedDate05'
					]), SalesContractDocumentTypeProcessor],
					presenter: {
						list: {}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(salesContractHeaderServiceOptions);

			// validation processor for new entities
			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'OrdHeaderDto',
				moduleSubModule: 'Sales.Contract',
				validationService: 'salesContractProjectContractValidationService',
				mustValidateFields: ['BusinesspartnerFk']
			});

			// create a contract dialog
			serviceContainer.service.createItem = function createContract() {
				salesContractCreateContractDialogService.resetToDefault();
				var selectedProject = projectMainService.getSelected();
				salesContractCreateContractDialogService.init({
					ProjectFk: _.get(selectedProject, 'Id', null),
					CurrencyFk: _.get(selectedProject, 'CurrencyFk', null)
				});
				salesContractCreateContractDialogService.showDialog().then(function (creationData) {
					// TODO:later refactoring required here server/client should have same property name for ConfigurationFk/ConfigurationId
					// Modify the creationData.data object to rename ConfigurationFk to ConfigurationId
					if (creationData.data.ConfigurationFk !== undefined) {
						creationData.data.ConfigurationId = creationData.data.ConfigurationFk;
					}
					serviceContainer.data.doCallHTTPCreate(creationData.data, serviceContainer.data, serviceContainer.data.onCreateSucceeded);
				}, ['projectfk'] /* readonly rows */);
			};
			return serviceContainer.service;

		}]);
})();
