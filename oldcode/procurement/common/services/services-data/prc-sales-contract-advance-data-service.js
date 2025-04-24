(function (angular) {
	/* global globals,_ */
	'use strict';

	var moduleName = 'procurement.common';

	angular.module(moduleName).factory('prcAndSalesContractAdvanceDataService', [
		'procurementCommonDataServiceFactory',
		'platformRuntimeDataService',
		'ServiceDataProcessDatesExtension',
		'basicsCommonMandatoryProcessor',
		'basicsLookupdataLookupDescriptorService',
		'procurementContextService',
		'basicsLookupdataLookupFilterService',
		'cloudDesktopPinningContextService',
		function (
			dataServiceFactory,
			platformRuntimeDataService,
			ServiceDataProcessDatesExtension,
			basicsCommonMandatoryProcessor,
			basicsLookupdataLookupDescriptorService,
			procurementContextService,
			basicsLookupdataLookupFilterService,
			pinningService
		) {
			function constructorFn(parentService) {
				var area = 'procurement';
				moduleName = parentService.getModule().name;
				if (moduleName.match('sales')) {
					area = 'sales';
				}
				var serviceOption = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'procurementContractAdvanceDataService',
						entityNameTranslationID: 'procurement.contract.advanceGridTitle',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'procurement/contract/advance/',
							endRead: 'list',
							initReadData: initReadData
						},
						dataProcessor: [new ServiceDataProcessDatesExtension(['DateDue', 'DateDone'])],
						presenter: {
							list: {
								initCreationData: initCreationData,
								incorporateDataRead: incorporateDataRead
							}
						},
						entityRole: {
							leaf: {
								itemName: 'Advance',
								parentService: parentService,
								doesRequireLoadAlways: false
							}
						}
					}
				};
				if (area === 'sales') {
					serviceOption.flatLeafItem.httpCRUD = {
						route: globals.webApiBaseUrl + 'sales/contract/advance/',
						endRead: 'listByParent',
						usePostForRead: true,
						initReadData: initReadData
					};
					serviceOption.flatLeafItem.entityRole.leaf.itemName = 'OrdAdvance';
					serviceOption.flatLeafItem.actions = {
						delete: true, create: 'flat',
						canCreateCallBackFunc: function () {
							var parentItem = parentService.getSelected();
							return parentItem && parentItem.Id && !parentItem.IsReadonlyStatus;
						},
						canDeleteCallBackFunc: function () {
							var parentItem = parentService.getSelected();
							return !parentItem.IsReadonlyStatus;
						}
					};
				}

				var serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
				var service = serviceContainer.service;

				if (area === 'sales') {
					serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
						typeName: 'OrdAdvanceDto',
						moduleSubModule: 'Sales.Contract',
						validationService: 'salesContractAdvanceValidationService',
						mustValidateFields: [
							'SlsAdvanceTypeFk',
							'OrdAdvanceStatusFk',
							'ReductionValue',
							'AmountDone',
							'AmountDoneOc',
							'AmountDue',
							'AmountDueOc',
							'BilHeaderFk'
						]
					});

					basicsLookupdataLookupDescriptorService.loadData('OrdAdvanceStatus');
					basicsLookupdataLookupDescriptorService.attachData({
						reductionrule: [
							{Id: 1, Description: 'Percentage of Total Work'},
							{Id: 2, Description: 'Percentage of Increase'},
							{Id: 3, Description: 'Percentage of Advance Payment Amount'},
							{Id: 4, Description: 'Absolute Amount'}
						]
					});
				}

				var setReadonlyor = function () {
					if (area === 'procurement') {
						var getModuleStatusFn = parentService.getItemStatus || parentService.getModuleState;
						if (getModuleStatusFn) {
							var status = getModuleStatusFn();
							return !(status.IsReadOnly || status.IsReadonly);
						}
						return false;
					}
					else {
						var parentItem = parentService.getSelected();
						if (parentItem) {
							return !parentItem.IsReadonlyStatus;
						}
						return false;
					}
				};
				var canCreate = serviceContainer.service.canCreate;
				service.canCreate = function () {
					return canCreate() && setReadonlyor();
				};
				var canDelete = serviceContainer.service.canDelete;
				service.canDelete = function () {
					return canDelete() && setReadonlyor();
				};

				function initReadData(readData) {
					if (area === 'procurement') {
						readData.filter = '?mainItemId=' + parentService.getSelected().Id;
					}
					else {
						var sel = parentService.getSelected();
						readData.PKey1 = sel.Id;
					}
				}

				function initCreationData(creationData) {
					creationData.PKey1 = parentService.getSelected().Id;
				}

				function incorporateDataRead(readData, data) {
					var returnData = {};
					if (area === 'procurement') {
						returnData = readData;
					}
					else {
						returnData = readData.Main;
					}
					var Isreadonly = !setReadonlyor();
					var itemList = data.handleReadSucceeded(returnData, data, true);
					if (Isreadonly) {
						service.setRowReadonly(returnData);
					}
					return itemList;
				}

				service.setRowReadonly = function (items) {
					if (_.isArray(items)) {
						_.forEach(items, function (item) {
							platformRuntimeDataService.readonly(item, true);
						});
					}
				};

				// if current module is sales than only we will register this filter
				if (area === 'sales') {
					var filters = [
						{
							key: 'sales-contract-advance-billing-filter',
							fn: function (item, entity) {
								var pinnedProject = pinningService.getPinnedId('project.main');
								if (pinnedProject) {
									return item.ProjectFk === pinnedProject;
								}
								else {
									return item;
								}
							}
						}
					];
					basicsLookupdataLookupFilterService.registerFilter(filters);

				}

				return service;
			}
			
			return dataServiceFactory.createService(constructorFn, 'prcAndSalesContractAdvanceDataService');
		}
	]);
})(angular);