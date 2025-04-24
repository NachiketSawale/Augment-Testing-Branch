

(function () {
	'use strict';
	/* global globals */
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	estimateMainModule.factory('estimateMainPrcItemAssignmentListService',
		['_','$timeout','$q', '$injector', '$http', 'platformDataServiceFactory', 'platformRuntimeDataService','platformDataServiceProcessDatesBySchemeExtension','estimateMainService','estimateMainResourceService','basicsLookupdataLookupFilterService','platformDataServiceDataPresentExtension','PlatformMessenger',
			function (_,$timeout, $q, $injector, $http, platformDataServiceFactory, platformRuntimeDataService,platformDataServiceProcessDatesBySchemeExtension,estimateMainService,estimateMainResourceService,basicsLookupdataLookupFilterService,platformDataServiceDataPresentExtension,PlatformMessenger) {
				let serviceContainer = {};
				let service;
				let containerData;
				let isFilterByResFlag = null;
				let serviceOptions = {
					flatLeafItem: {
						module: estimateMainModule,
						serviceName: 'estimateMainPrcItemAssignmentListService',
						entityNameTranslationID: 'estimate.detail.ItemAssignment',
						httpRead: {
							route: globals.webApiBaseUrl + 'procurement/common/prcitemassignment/',
							endRead: 'getPrcItemAssignments',
							usePostForRead: true,
							initReadData: function initReadData(readData) {
								readData.LineItemFk = estimateMainService.getSelected () ? estimateMainService.getSelected ().Id : null;
								readData.EstHeaderFk = estimateMainService.getSelected () ? estimateMainService.getSelected ().EstHeaderFk : null;
								readData.ResourceFk = estimateMainResourceService.getSelected () ? estimateMainResourceService.getSelected ().Id : null;
								service.setFilterByResFlag(!!readData.ResourceFk);
							}
						},
						httpCreate: {
							route: globals.webApiBaseUrl + 'procurement/common/prcitemassignment/',
							endCreate: 'createnew'
						},
						httpUpdate: {
							route: globals.webApiBaseUrl + 'procurement/common/prcitemassignment/',
						},
						httpDelete: {
							route: globals.webApiBaseUrl + 'procurement/common/prcitemassignment/',
						},
						dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor ({
							typeName: 'PrcItemAssignmentDto',
							moduleSubModule: 'Procurement.Common'
						})],
						actions: {
							delete: true, create: 'flat',
							canCreateCallBackFunc: function () {
								let data =service.getLookupData();
								service.processItem(data);
								return !!estimateMainService.getSelected ();
							}
						},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									creationData.LineItemFk = estimateMainService.getSelected () ? estimateMainService.getSelected ().Id : null;
									creationData.EstHeaderFk = estimateMainService.getSelected () ? estimateMainService.getSelected ().EstHeaderFk : null;
									creationData.ResourceFk = estimateMainResourceService.getSelected () ? estimateMainResourceService.getSelected ().Id : null;
									creationData.IsManually = !!creationData.ResourceFk;
								},
								incorporateDataRead: function (readData, data) {
									$injector.get('procurementPackageBoqLookupService').setPackageBoqItems(readData.packageboqitems);
									service.processItem(readData.dtos);
									return serviceContainer.data.handleReadSucceeded (readData.dtos, data);
								},
								handleCreateSucceeded: function (newData) {
									service.setColumnsReadOnly(newData,['PrcItemFk'],!newData.EstResourceFk);
									newData.PrcPackageFk = !newData.PrcPackageFk? null:newData.PrcPackageFk;
									newData.BoqHeaderFk = newData.BoqItemFk = newData.PrcItemFk = newData.BoqHeaderReference = null;
									return newData;
								}
							}
						},
						entityRole: {
							leaf: {itemName: 'EstimateMainPrcItemAssignments', parentService: estimateMainService}
						}
					}
				};
				serviceContainer = platformDataServiceFactory.createNewComplete (serviceOptions);
				containerData  = serviceContainer.data;
				containerData.newEntityValidator = {
					validate: function validate(entity) {
						$injector.get('estimateMainPrcItemAssignmentListValidationService').validatePrcPackageFk(entity, entity.PrcPackageFk, 'PrcPackageFk');
					}
				};
				serviceContainer.data.usesCache = false;
				service = serviceContainer.service;
				service.onToolsUpdated = new PlatformMessenger();
				serviceContainer.data.handleOnDeleteSucceeded = function () {
					estimateMainService.updatePackageAssignment.fire();
					estimateMainResourceService.updateResourcePackageAssignment.fire();
				};

				let filters = [
					{
						key: 'estimate-item-assignment-est-resource-filter',
						serverSide: true,
						serverKey: 'estimate-item-assignment-est-resource-filter',
						fn: function (entity) {
							return {
								estHeaderFk: entity.EstHeaderFk,
								estLineItemFk: entity.EstLineItemFk,
								notIncludedResourceIds:[]
							};
						}
					},
					{
						key: 'estimate-item-prc-item-assignment-item-filter',
						serverSide: true,
						serverKey: 'estimate-item-prc-item-assignment-item-filter',
						fn: function (entity) {
							return {PrcPackageFk: (entity.PrcPackageFk?entity.PrcPackageFk:-1)};
						}
					}
				];
				basicsLookupdataLookupFilterService.registerFilter (filters);

				service.setFilterByResFlag = function setFilterByResFlag(value) {
					isFilterByResFlag = value;
				};

				service.getFilterByResFlag = function getFilterByResFlag() {
					return isFilterByResFlag;
				};

				service.getContainerData = function getContainerData() {
					return containerData;
				};

				service.updatePrcItemAssignment = function updatePrcItemAssignment() {
					let selectedRes = estimateMainResourceService.getSelected();
					if(isFilterByResFlag || selectedRes ){
						estimateMainService.load();
					}else{
						estimateMainResourceService.load();
					}
					service.onToolsUpdated.fire();
				};
				service.processItem = function processItem(items) {
					_.each(items,function (item){
						if (item && (item.IsPackageStatusContracted || item.IsContracted)) {
							service.setColumnsReadOnly(item, ['PrcPackageFk', 'EstResourceFk'], true);
						}
						service.setColumnsReadOnly(item,['PrcItemFk'],!item.EstResourceFk);
					});
				};
				service.setColumnsReadOnly = function setColumnsReadOnly(item, columns, flag) {
					let fields = [];
					_.each(columns, function (column) {
						fields.push({field: column, readonly: flag});
					});
					platformRuntimeDataService.readonly(item, fields);
				};

				service.needLoadData = function needLoadData() {
					return containerData.doesRequireLoadAlways || platformDataServiceDataPresentExtension.isServicePresented(containerData, service);
				};
				let baseOnCreateItem = service.createItem;
				service.createItem = function createItem() {
					const estimateMainService = $injector.get('estimateMainService');
					const lineItem = estimateMainService.getSelected();
					if (lineItem && !estimateMainService.isLineItemStatusReadonly(lineItem.Id, lineItem.EstHeaderFk)) {
						baseOnCreateItem(null,serviceContainer.data);
					}
				};
				let baseDeleteSelection = service.deleteSelection;
				service.deleteSelection = function deleteSelection() {
					if (estimateMainService.isReadonly()) {
						return $injector.get('platformDialogService').showDialog({iconClass: 'info', headerText$tr$: 'cloud.common.infoBoxHeader', bodyText$tr$: 'estimate.main.readOnlyPackageItemAssignmentDeleteText', showOkButton: true});
					}else {
						baseDeleteSelection();
					}
				}
				return service;
			}]);
})();