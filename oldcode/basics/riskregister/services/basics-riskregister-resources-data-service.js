(function (angular) {
	/*global angular, globals,_*/
	'use strict';
	var moduleName = 'basics.riskregister';
	angular.module(moduleName).service('basicsRiskregisterResourcesDataService', [
		'$http','$injector','basicsRiskRegisterDataService','platformDataServiceFactory','PlatformMessenger',
		'estimateMainResourceImageProcessor','estimateMainService','ServiceDataProcessArraysExtension','estimateMainResourceProcessor',
		function ($http,$injector,basicsRiskRegisterDataService,platformDataServiceFactory,PlatformMessenger,
		          estimateMainResourceImageProcessor,estimateMainService,ServiceDataProcessArraysExtension,estimateMainResourceProcessor) {

			var serviceOptions = {
				hierarchicalNodeItem:{
					module: angular.module(moduleName),
					serviceName: 'basicsRiskregisterResourcesDataService',
					entityNameTranslationID: 'basics.riskregister.assignedResoursesGridTitle',
					httpCreate:{route: globals.webApiBaseUrl + 'basics/riskregister/resources/', endCreate: 'create'},
					httpRead: {
						route: globals.webApiBaseUrl + 'basics/riskregister/resources/',
						endRead:'master_list',
						initReadData: function initReadData(readData) {
							var selectedItem = basicsRiskRegisterDataService.getSelected();
							if(selectedItem && selectedItem.hasOwnProperty('Id')){
								readData.riskEventFk = selectedItem.Id;

							}

						},
						usePostForRead: true
					},
					httpUpdate: {route: globals.webApiBaseUrl + 'basics/riskregister/resources/', endUpdate: 'update'},
					entitySelection: {},
					setCellFocus:true,
					presenter: {
						tree: {
							parentProp: 'RiskResourcesFk', childProp: 'RiskResources', childSort: true, isDynamicModified: false,
							initCreationData: function initCreationData() {
								//var selectedItem = basicsRiskRegisterDataService.getSelected();
								//var selectedResourceItem = serviceContainer.service.getSelected();

								//creationData.projectId = estimateMainService.getSelectedProjectId();
								/*if (selectedResourceItem && selectedResourceItem.Id > 0) {
									creationData.resourceItemId = creationData.parentId;
									creationData.estHeaderFk = selectedResourceItem.EstHeaderFk;
									creationData.estLineItemFk = selectedResourceItem.EstLineItemFk;
									creationData.Currency1Fk = selectedResourceItem.Currency1Fk;
									creationData.Currency2Fk = selectedResourceItem.Currency2Fk;
								} else if (selectedItem && selectedItem.Id > 0) {
									creationData.estHeaderFk = selectedItem.EstHeaderFk;
									creationData.estLineItemFk = selectedItem.Id;
									creationData.Currency1Fk = selectedItem.Currency1Fk;
									creationData.Currency2Fk = selectedItem.Currency2Fk;
								}
								creationData.sortNo = estimateMainGenerateSortingService.generateSorting(selectedResourceItem, service.getList(), creationData);
							*/},
							incorporateDataRead: function incorporateDataRead(readData, data) {
								if(readData.dtos && readData.dtos.length > 0 ){
									serviceContainer.data.handleReadSucceeded(readData.dtos, data);
								}
								//we add default characteristics and existing characteristics to the result list and update the grid columns
								//$injector.get('estimateMainResourceCharacteristicsService').setDynamicColumnsLayout(readData);
								//setResourceCurrencies(readData.dtos);

								//setDataOriginal(readData);
								//setLookupData(readData.dtos);
								//$injector.get('estimateMainCostUnitManageService').setEnableEstResourceCostUnitAdvanceEditing(readData.EnableEstResourceCostUnitAdvanceEditing);

								//var lineItem = estimateMainService.getSelected();
								//var defer = $q.defer();
								/*$injector.get('estimateMainResourceDetailService').setResourcesBusinessPartnerName(lineItem, readData.dtos).then(function () {
									defer.resolve(serviceContainer.data.handleReadSucceeded(readData.dtos, data));
								});*/

								//return defer.promise;
							},
							handleCreateSucceeded: function (newData) {
								//set Indirect Cost based on LineItem's IsGc flag
								var riskEvent = basicsRiskRegisterDataService.getSelected();
								if (riskEvent) {
									//service.setIndirectCost([newData], lineItem.IsGc);

									//newData.PrcPackageFk = lineItem.PrcPackageFk;
									//newData.PrcPackage2HeaderFk = lineItem.PrcPackage2HeaderFk;
									newData.RiskEventFk = riskEvent.Id;
									newData.isMaster = true;

								}
								/*newData.LgmJobFk = estimateMainService.getLgmJobId(newData);
								setNewResourceCurrency(newData);
								calculateCurrencies(newData);
								estimateMainCommonService.resetLookupItem();

								//we add default characteristics with default values to the new item
								estimateMainCommonService.appendCharactiricColumnData(getCharDefaults(), service, [newData], true);*/

								return newData;
							}
						}
					},
					dataProcessor: [new ServiceDataProcessArraysExtension(['EstResources']), estimateMainResourceImageProcessor, estimateMainResourceProcessor],
					entityRole: {
						node: {
							codeField: 'Code',
							itemName: 'RiskResource',
							moduleName: 'Basics RiskRegister Resources',
							parentService: basicsRiskRegisterDataService
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

			//Do not download data when container is not displayed
			serviceContainer.data.doesRequireLoadAlways = false;

			var service = serviceContainer.service;

			service.toolHasAdded = false;

			service.refreshData = new PlatformMessenger();

			service.fireListLoaded = function fireListLoaded() {
				serviceContainer.data.listLoaded.fire();
			};

			service.updateList = function updateList(resList, isReadOnly){
				service.setList(resList, isReadOnly);
				service.fireListLoaded();
			};

			service.handleUpdateDone = handleUpdateDone;
			service.fieldChange = fieldChange;

			service.getAssemblyLookupSelectedItems = function getAssemblyLookupSelectedItems(entity, assemblySelectedItems){
				if (!_.isEmpty(assemblySelectedItems) && _.size(assemblySelectedItems) > 1){
					var assemblyIds = _.map(assemblySelectedItems, 'Id');
					var riskID = basicsRiskRegisterDataService.getSelected();
					var resourceTypeAssembly = 4;

					//service.resolveResourcesAndAssign(riskID, assemblyIds, resourceTypeAssembly);
					service.refreshMasterList(riskID,  assemblyIds, resourceTypeAssembly);
				}
			};

			service.getCostCodeLookupSelectedItems = function getCostCodeLookupSelectedItems(entity, costCodeSelectedItems){
				if (!_.isEmpty(costCodeSelectedItems) && _.size(costCodeSelectedItems) > 1){
					var costCodeIds = _.map(costCodeSelectedItems, 'OriginalId');
					var riskID = basicsRiskRegisterDataService.getSelected();
					var resourceTypeCostCode = 1;

					//service.resolveResourcesAndAssign(riskID, costCodeIds, resourceTypeCostCode);
					service.refreshMasterList(riskID, costCodeIds, resourceTypeCostCode);
				}
			};

			service.getMaterialLookupSelectedItems = function getMaterialLookupSelectedItems(entity, materialSelectedItems){
				if (!_.isEmpty(materialSelectedItems) && _.size(materialSelectedItems) > 1){
					var materialIds = _.map(materialSelectedItems, 'Id');
					var assemblyItem = basicsRiskRegisterDataService.getSelected();
					var resourceTypeMaterial = 2;

					//service.resolveResourcesAndAssign(assemblyItem, materialIds, resourceTypeMaterial);
					service.refreshMasterList(assemblyItem, materialIds, resourceTypeMaterial);
				}
			};

			service.setSelectedLookupItem = function(costCodeLookupItem){
				var itemSelected = service.getSelected();
				if(itemSelected && costCodeLookupItem){
					itemSelected.Code = costCodeLookupItem.Code;
					itemSelected.MdcCostCodeFk = costCodeLookupItem.Id;
					itemSelected.DescriptionInfo = costCodeLookupItem.DescriptionInfo;
				}
			};

			service.setSelectedMaterialLookupItem = function(materialLookupItem){
				var itemSelected = service.getSelected();
				if(itemSelected && materialLookupItem){
					itemSelected.Code = materialLookupItem.Code;
					itemSelected.MdcMaterialFk = materialLookupItem.Id;
					itemSelected.DescriptionInfo = materialLookupItem.DescriptionInfo;

				}
			};

			service.setSelectedAssemblyLookupItem = function(assemblyLookupItem){
				var itemSelected = service.getSelected();
				if(itemSelected && assemblyLookupItem){
					itemSelected.Code = assemblyLookupItem.Code;
					itemSelected.AssemblyFk = assemblyLookupItem.Id;
					itemSelected.AssemblyHeaderFk = assemblyLookupItem.EstHeaderFk;
					itemSelected.DescriptionInfo = assemblyLookupItem.DescriptionInfo;
				}
			};

			// Resolve function to process resource, returns processed resource(Assembly converted, Cost code, Material processed) in tree structure
			/*service.resolveResourcesAndAssign = function resolveResourcesAndAssign(lineItem, assemblyIds, resourceType){
				//var selectedResource = service.getSelected();

				var postData = {
					MainItemId: lineItem.Id,
					ItemIds: assemblyIds,
					ResourceType: resourceType,
				};
				return getAssemblyResourcesRequest(postData);
			};*/

			// Resolve function to process resource, returns processed resource(Assembly converted, Cost code, Material processed) in tree structure
			service.refreshMasterList = function refreshMasterList(lineItem, assemblyIds, resourceType){
				var postData = {
					MainItemId: lineItem.Id,
					ItemIds: assemblyIds,
					ResourceType: resourceType,
				};
				return getAssignedRiskResourcesRequest(postData);
			};

			return service;

			// Resolve assembly function
			/*function getAssemblyResourcesRequest(customPostData){

				var postData = {
					HeaderFk: estimateMainService.getSelectedEstHeaderId(),
					//AssemblyIds: assemblyIds, //Set customPostData to send assemblyIds
					SectionId: 33,
					ProjectId: estimateMainService.getSelectedProjectId()
				};

				angular.extend(postData, customPostData);
				var newResponse = null;
				$http.post(globals.webApiBaseUrl + 'basics/riskregister/resources/getresourcestoriskregister', postData).then(function(response){
					newResponse = response.data;
				}, function(err){
					console.error(err);
				});

				service.gridRefresh();
				return newResponse;
			}*/

			function getAssignedRiskResourcesRequest(customPostData){

				var postData = {
					HeaderFk: estimateMainService.getSelectedEstHeaderId(),
					//AssemblyIds: assemblyIds, //Set customPostData to send assemblyIds
					SectionId: 33,
					ProjectId: estimateMainService.getSelectedProjectId()
				};
				angular.extend(postData, customPostData);

				var newResponse = null;
				$http.post(globals.webApiBaseUrl + 'basics/riskregister/resources/assignedriskresources',postData).then(function(response){
					newResponse=response.data;
				},
				function(err){
					console.error(err);
				});

				service.gridRefresh();
				return newResponse;
			}

			function handleUpdateDone(data) {
				var itemListResponse = angular.copy(_.map(data, 'RiskResource'));

				var updateTree = function updateTree(list){
					_.forEach(list, function(oldItem){
						var updatedItem = _.find(itemListResponse,{ Id: oldItem.Id });
						if (updatedItem){
							oldItem.Version = updatedItem.Version;
						}
						if (oldItem.HasChildren){
							updateTree(oldItem.EstResources);
						}
					});
				};

				updateTree(serviceContainer.data.itemTree);

				var itemListOriginal = [];
				serviceContainer.data.flatten(serviceContainer.data.itemTree, itemListOriginal, serviceContainer.data.treePresOpt.childProp);
				estimateMainResourceImageProcessor.processItems(itemListOriginal);

				serviceContainer.data.itemListOriginal = angular.copy(itemListOriginal);

			}

			function fieldChange(item,field,column){

			}
		}
	]);
})(angular);
