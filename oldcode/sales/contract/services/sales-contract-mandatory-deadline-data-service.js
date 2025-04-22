(function () {
	'use strict';
	/* global globals */

	var moduleName = 'sales.contract';
	angular.module(moduleName).factory('ordMandatoryDeadlineDataFactory', [
		'platformDataServiceFactory',
		'ServiceDataProcessDatesExtension',
		'platformDataServiceProcessDatesBySchemeExtension',
		'salesCommonServiceCache',
		'basicsCommonMandatoryProcessor',
		'ordMandatoryDeadlineValidationFactory',
		'platformRuntimeDataService',
		function (
			platformDataServiceFactory,
			ServiceDataProcessDatesExtension,
			platformDataServiceProcessDatesBySchemeExtension,
			salesCommonServiceCache,
			basicsCommonMandatoryProcessor,
			validationFactory,
			platformRuntimeDataService
		) {
			function constructorFn(parentService) {
				var curModuleName = parentService.getModule().name;
				var factoryOptions = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'ordMandatoryDeadlineDataFactory',
						entityNameTranslationID: 'procurement.common.entityMandatoryDeadline',
						httpCreate: {route: globals.webApiBaseUrl + 'sales/common/ordmandatorydeadline/'},
						httpRead: {
							route: globals.webApiBaseUrl + 'sales/common/ordmandatorydeadline/',
							endRead: 'listByParent',
							usePostForRead: true,
							initReadData: function initReadData(readData) {
								var selected = parentService.getSelected();
								if (curModuleName === 'sales.contract') {
									readData.PKey1 = selected.Id;
									readData.PKey2 = null;
								}
								else if (curModuleName === 'sales.bid') {
									readData.PKey1 = null;
									readData.PKey2 = selected.Id;
								}
							}
						},
						actions: {delete: true, create: 'flat'},
						entityRole: {
							leaf: {
								itemName: 'OrdMandatoryDeadline',
								parentService: parentService
							}
						},
						presenter: {
							list: {
								incorporateDataRead: incorporateDataRead,
								initCreationData: function initCreationData(creationData) {
									var selected = parentService.getSelected();
									if (curModuleName === 'sales.contract') {
										creationData.PKey1 = selected.Id;
										creationData.PKey2 = null;
									}
									else if (curModuleName === 'sales.bid') {
										creationData.PKey1 = null;
										creationData.PKey2 = selected.Id;
									}
								}
							}
						},
						dataProcessor: [{processItem: readonlyProcessItem}, platformDataServiceProcessDatesBySchemeExtension.createProcessor({
							typeName: 'OrdMandatoryDeadlineDto',
							moduleSubModule: 'Sales.Common'
						})]
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
				var service = serviceContainer.service;
				var validation = validationFactory.getService(service);
				serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					typeName: 'OrdMandatoryDeadlineDto',
					moduleSubModule: 'Sales.Common',
					validationService: validation,
					mustValidateFields: ['Start', 'End']
				});

				var setReadonlyor = function () {
					var getModuleStatusFn = parentService.getModuleState;
					if (getModuleStatusFn) {
						var status = getModuleStatusFn();
						return !(status.IsReadOnly || status.IsReadonly);
					}
					return false;
				};

				function incorporateDataRead(readData, data) {
					var Isreadonly = !setReadonlyor();
					var itemList = data.handleReadSucceeded(readData.Main, data);
					if (Isreadonly) {
						service.setReadOnlyRow(readData);
					}
					return itemList;
				}

				function readonlyProcessItem(item) {
					var Isreadonly = !setReadonlyor();

					platformRuntimeDataService.readonly(item, Isreadonly);
				}

				var canCreate = serviceContainer.service.canCreate;
				var canDelete = serviceContainer.service.canDelete;

				serviceContainer.service.canCreate = function () {
					return canCreate() && setReadonlyor();
				};
				serviceContainer.service.canDelete = function () {
					return canDelete() && setReadonlyor();
				};

				return service;
			}

			return salesCommonServiceCache.registerService(constructorFn, 'ordMandatoryDeadlineDataFactory');
		}]);
})();