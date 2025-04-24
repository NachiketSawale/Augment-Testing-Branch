/**
 * Created by wuj on 8/27/2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.procurementconfiguration';
	angular.module(moduleName)
		.factory('basicsProcurementConfigurationDataService',
			['$injector','platformDataServiceFactory', 'basicsProcurementConfigurationRubricCategoryService', 'basicsProcurementConfigHeaderDataService','$q','platformDataServiceModificationTrackingExtension', 'platformRuntimeDataService',
				'basicsCommonCharacteristicService','platformGridAPI',
				function ($injector,dataServiceFactory, rubricCategoryService, parentService,$q,platformDataServiceModificationTrackingExtension, platformRuntimeDataService,basicsCommonCharacteristicService,
					  platformGridAPI) {
					var characteristicColumn = '';
					var gridContainerGuid = 'ecf49aee59834853b0f78ee871676e38';
					var configHeader, rubricCategory;
					var serviceOptions = {
						flatNodeItem: {
							module: angular.module(moduleName),
							serviceName: 'basicsProcurementConfigurationDataService',
							httpCRUD: {
								route: globals.webApiBaseUrl + 'basics/procurementconfiguration/configuration/',
								usePostForRead: true,
								initReadData: function (readData) {
									var configHeader = parentService.getSelected();
									if (configHeader) {
										readData.mainItemId = configHeader.Id;
									}
									readData.RubricCategoryIds = rubricCategoryService.getRubricCategoryIds();
								}
							},
							presenter: {
								list: {
									initCreationData: initCreationData,
									incorporateDataRead: incorporateDataRead,
									handleCreateSucceeded: function (item) {
										basicsCommonCharacteristicService.onEntityCreated(serviceContainer.service, item, 32, 55);
										var exist = platformGridAPI.grids.exist(gridContainerGuid);
										if (exist) {
											var containerInfoService = $injector.get('basicsProcurementConfigurationContainerInformationService');
											var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(service, 55, gridContainerGuid,containerInfoService);
											characterColumnService.appendDefaultCharacteristicCols(item);
										}
									}
								}
							},
							actions: {
								delete: true, create: 'flat',
								canCreateCallBackFunc: function () {
									rubricCategory = rubricCategoryService.getSelected();
									if(rubricCategory){
										return rubricCategory.Id && !rubricCategory.HasChildren;
									}else{
										return false;
									}

								}
							},
							entityRole: {
								node: {
									itemName: 'PrcConfiguration',
									parentService: parentService
								}
							},
							dataProcessor: [{
								processItem: readonlyProcess
							}],
							translation: {
								uid: '4C57704FB56F45F9AEE6980A11F818CA',
								title: 'basics.procurementconfiguration.configurationGridTitle',
								columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
								dtoScheme: { typeName: 'PrcConfigurationDto', moduleSubModule: 'Basics.ProcurementConfiguration' }
							}
						}
					};

					var serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);
					var data = serviceContainer.data;
					var service = serviceContainer.service;

					data.doesRequireLoadAlways = true;//To be on the safe side, as I do not know if the basicsProcurementConfigurationDataService data is needed somewhere else

					//Frank B., 2016-02-10: The line commented out is replaced by the three functions below.
					//This is necessary as basicsProcurementConfigurationDataService load behavior depends on the rubricCategoryService
					//parentService.unregisterSelectionChanged(serviceContainer.data.loadSubItemList);
					service.loadSubItemList = function loadSubItemListFromService() {
						return $q.when(data.itemList);//We do not want to load in the norml process
					};

					data.killRunningLoad = function killRunningLoadInInstanceData() {//We do not kill, as we use old event based loading, being connected for load
					//not directly to the parent data service
					};

					data.killRunningLoad = function killRunningLoadInInstanceService() {//We do not kill, as we use old event based loading, being connected for load
					//not directly to the parent data service
					};

					serviceContainer.service.setCharacteristicColumn = function setCharacteristicColumn(colName) {
						characteristicColumn = colName;
					};
					serviceContainer.service.getCharacteristicColumn = function getCharacteristicColumn() {
						return characteristicColumn;
					};

					basicsCommonCharacteristicService.unregisterCreateAll(serviceContainer.service, 32, 55);

					var updateAndLoadSubItem = function () {
					//var Configrationservice=$injector.get('basicsLookupdataSimpleLookupService');
						var updated = false;
						var updateDataImmediately = platformDataServiceModificationTrackingExtension.getModifications(serviceContainer.service);
						if (updateDataImmediately) {
							if ((updateDataImmediately.PrcConfigurationToSave && updateDataImmediately.PrcConfigurationToSave.length > 0 ||updateDataImmediately.PrcConfigurationToDelete && updateDataImmediately.PrcConfigurationToDelete.length > 0 )&& updateDataImmediately.EntitiesCount > 0) {
								updated = true;
								parentService.updateAndExecute(data.loadSubItemList);
							}
						}
						if (updated === false) {
							service.load();
						}
					//parentService.updateAndExecute(data.loadSubItemList);
					// if(service.isModelChanged()) {
					// 	parentService.updateAndExecute(data.loadSubItemList);
					// }
					};
					rubricCategoryService.registerSelectionChanged(updateAndLoadSubItem);

					function processIsPackageOrContractRubric(item){
						rubricCategory = rubricCategoryService.getSelected();
						if(rubricCategory) {
							var rubricFk = Math.abs(rubricCategory.RubricFk || rubricCategory.Id);
							var contractRubricId = 26;
							var packageRubricId = 31;

							item.IsContractRubric = (rubricFk === contractRubricId);
							item.IsPackageRubric = (rubricFk === packageRubricId);
						}
					}

					function readonlyProcess(item) {
						if(!(item.IsPackageRubric || item.IsContractRubric)){
							processIsPackageOrContractRubric(item);
						}
						var isReadonly = !(item.IsPackageRubric || item.IsContractRubric);
						platformRuntimeDataService.readonly(item, [{field:'BaselineIntegration',readonly:isReadonly}]);
					}

					function incorporateDataRead(readData, data) {
						var items = readData.Main ? readData.Main : readData;
						_.forEach(items, function (item) {
							var readonly = !item.IsContractRubric;
							var fields = [
								{field: 'ProvingPeriod', readonly: readonly},
								{field: 'ProvingDealdline', readonly: readonly},
								{field: 'ApprovalPeriod', readonly: readonly},
								{field: 'ApprovalDealdline', readonly: readonly},
								{field: 'BaselineIntegration', readonly: readonly}
							];
							platformRuntimeDataService.readonly(item, fields);

							if(item.IsPackageRubric){
								platformRuntimeDataService.readonly(item, [{field:'BaselineIntegration',readonly:false}]);
							}
						});
						var dataRead = serviceContainer.data.handleReadSucceeded(items, data);
						var exist = platformGridAPI.grids.exist(gridContainerGuid);
						if (exist) {
							var containerInfoService = $injector.get('basicsProcurementConfigurationContainerInformationService');
							var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(service, 55, gridContainerGuid,containerInfoService);
							characterColumnService.appendCharacteristicCols(items);
						}
						return dataRead;

					}

					return service;

					function initCreationData(creationData) {
						configHeader = parentService.getSelected();
						if (configHeader) {
							creationData.mainItemId = configHeader.Id; //todo-jack: figure out why add mainItemId
						}

						var rubricCategory = rubricCategoryService.getSelected();
						if (rubricCategory) {
							creationData.rubricCategoryId = rubricCategory.Id;
						}
						var dataList = service.getList();
						if(dataList.length > 0){
							dataList = _.sortBy(dataList,'Sorting');
							creationData.currentMaxSorting = dataList[dataList.length-1].Sorting;
						}else{
							creationData.currentMaxSorting = 1;
						}
					}

				}]);
})(angular);