(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	var moduleName = 'procurement.contract';
	var callOffAgreementModule = angular.module(moduleName);
	callOffAgreementModule.factory('procurementContractCallOffAgreementDataService', ['globals', 'procurementContractHeaderDataService', 'platformDataServiceFactory', 'ServiceDataProcessDatesExtension', 'platformDataServiceProcessDatesBySchemeExtension', 'procurementContractCallOffAgreementValidationProcessor', 'platformRuntimeDataService','procurementContextService',

		function (globals, procurementContractHeaderDataService, platformDataServiceFactory, ServiceDataProcessDatesExtension, platformDataServiceProcessDatesBySchemeExtension, procurementContractCallOffAgreementValidationProcessor, platformRuntimeDataService, procurementContextService) {
			var serviceContainer;
			var setReadonlyor;
			var factoryOptions = {
				flatLeafItem: {
					module: callOffAgreementModule,
					serviceName: 'procurementContractCallOffAgreementDataService',
					entityNameTranslationID: 'procurement.common.entityCallOffAgreement',
					httpCreate: {route: globals.webApiBaseUrl + 'procurement/common/prccalloffagreement/'},
					httpRead: {
						route: globals.webApiBaseUrl + 'procurement/common/prccalloffagreement/',
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
						leaf: {itemName: 'CallOffAgreement', parentService: procurementContractHeaderDataService}
					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = procurementContractHeaderDataService.getSelected();
								creationData.PKey1 = null;
								creationData.PKey2 = selected.Id;
							},
							incorporateDataRead: function incorporateDataRead(readItems, data) {
								var Isreadonly = !setReadonlyor();
								var dataRead = serviceContainer.data.handleReadSucceeded(readItems, data, true);
								if (Isreadonly) {
									serviceContainer.service.setFieldReadonly(readItems);
								}
								return dataRead;
							}
						}
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({typeName: 'PrcCallOffAgreementDto', moduleSubModule: 'Procurement.Common'})]
				}
			};

			serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			serviceContainer.data.newEntityValidator = procurementContractCallOffAgreementValidationProcessor;
			setReadonlyor = function () {
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

			var readonlyFields = [
				{field: 'CallOffAgreement', readonly: true}, {field: 'LeadTime', readonly: true},
				{field: 'EarliestStart', readonly: true}, {field: 'LatestStart', readonly: true},
				{field: 'ExecutionDuration', readonly: true}, {field: 'ContractPenalty', readonly: true}];

			serviceContainer.service.setFieldReadonly = function (items) {
				if (_.isArray(items)) {
					_.forEach(items, function (item) {
						platformRuntimeDataService.readonly(item, readonlyFields);
					});
				}
			};
			return serviceContainer.service;

		}]);
})(angular);
