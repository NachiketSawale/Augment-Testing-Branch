(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.contract';
	var mandatoryDeadlineModule = angular.module(moduleName);
	mandatoryDeadlineModule.factory('procurementContractMandatoryDeadlineDataService', ['globals', 'procurementContractHeaderDataService', 'platformDataServiceFactory', 'ServiceDataProcessDatesExtension', 'platformDataServiceProcessDatesBySchemeExtension', 'procurementContractMandatoryDeadlineValidationProcessor','procurementContextService',

		function (globals, procurementContractHeaderDataService, platformDataServiceFactory, ServiceDataProcessDatesExtension, platformDataServiceProcessDatesBySchemeExtension, procurementContractMandatoryDeadlineValidationProcessor, procurementContextService) {

			var factoryOptions = {
				flatLeafItem: {
					module: mandatoryDeadlineModule,
					serviceName: 'procurementContractMandatoryDeadlineDataService',
					entityNameTranslationID: 'procurement.common.entityMandatoryDeadline',
					httpCreate: {route: globals.webApiBaseUrl + 'procurement/common/prcmandatorydeadline/'},
					httpRead: {
						route: globals.webApiBaseUrl + 'procurement/common/prcmandatorydeadline/',
						endRead: 'list',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							var selected = procurementContractHeaderDataService.getSelected();
							readData.PKey1 = null;
							readData.PKey2 = selected.Id;
						}
					},
					actions: {delete: true, create: 'flat'},
					entityRole: {
						leaf: {itemName: 'MandatoryDeadline', parentService: procurementContractHeaderDataService}
					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = procurementContractHeaderDataService.getSelected();
								creationData.PKey1 = null;
								creationData.PKey2 = selected.Id;
							}
						}
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({typeName: 'PrcMandatoryDeadlineDto', moduleSubModule: 'Procurement.Common'})]
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			serviceContainer.data.newEntityValidator = procurementContractMandatoryDeadlineValidationProcessor;

			var setReadonlyor = function () {
				var getModuleStatusFn = procurementContractHeaderDataService.getItemStatus || procurementContractHeaderDataService.getModuleState;
				if (getModuleStatusFn) {
					var status = getModuleStatusFn();
					return !(status.IsReadOnly || status.IsReadonly);
				}
				return false;
			};
			var canCreate = serviceContainer.service.canCreate;
			serviceContainer.service.canCreate = function () {
				return canCreate() && setReadonlyor();
			};
			var canDelete = serviceContainer.service.canDelete;
			serviceContainer.service.canDelete = function () {
				return canDelete() && setReadonlyor();
			};

			return serviceContainer.service;

		}]);
})(angular);
