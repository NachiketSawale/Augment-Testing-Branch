
(function () {
	'use strict';
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);

	estimateMainModule.factory('estStandardAllowancesCostCodeDetailDataService', [
		'$q','$http','$injector','platformTranslateService','PlatformMessenger','estimateRuleComplexLookupCommonService',
		'platformDataServiceFactory','platformGridAPI','cloudCommonGridService','globals','estimateMainStandardAllowancesDataService',
		'_','platformDataValidationService','platformRuntimeDataService','platformDataServiceModificationTrackingExtension','platformDataServiceSelectionExtension',
		'platformDataServiceEntitySortExtension','estimateMainOnlyCostCodeAssignmentDetailLookupDataService','platformModuleStateService','basicsCommonChangeColumnConfigService','mainViewService',
		'estimateMainStandardMarkupAllowanceProcessor','estimateMainAllowanceAreaService',
		function ($q,$http,$injector,platformTranslateService,PlatformMessenger,estimateRuleComplexLookupCommonService,
			platformDataServiceFactory,platformGridAPI,cloudCommonGridService,globals,estimateMainStandardAllowancesDataService,
			_,platformDataValidationService,runtimeDataService,platformDataServiceModificationTrackingExtension,platformDataServiceSelectionExtension,
			platformDataServiceEntitySortExtension,estimateMainOnlyCostCodeAssignmentDetailLookupDataService,platformModuleStateService,basicsCommonChangeColumnConfigService,mainViewService,
			estimateMainStandardMarkupAllowanceProcessor,estimateMainAllowanceAreaService) {

			let service = {};
			let container = {};
			let allCostCodes = [];
			let gridId = 'e4a0ca6ff2214378afdc543646e6b079';
			let totalEntity = {};
			let estHeaderFk = 0;
			let allColumns = [];
			const commonColumns = [
				'indicator',
				'tree',
				'mdccostcodefk',
				'mdccostcodeDescription',
				'djctotal',
				'gctotal',
				'djctotalop',
				'gaperc',
				'rpperc',
				'amperc',
				'graperc',
				'finm',
				'defmop',
				'finmop',
				'gavalue',
				'rpvalue',
				'amvalue',
				'gcvalue',
				'fmvalue',
				'allowancevalue',
				'insertedat',
				'insertedby',
				'updatedat',
				'updatedby'];

			let simpleOneStep = commonColumns.concat(['defmperc']);

			let simpleTwoStep = commonColumns.concat(['defmgraperc','finmgra','defmgcperc','finmgc']);

			let MarkupOneStep = commonColumns.concat(['defmgcperc']);

			let MarkupTwoStep = commonColumns.concat(['defmgcperc']);

			let serviceOption = {
				hierarchicalLeafItem: {
					module: moduleName,
					serviceName: 'estStandardAllowancesCostCodeDetailDataService',
					entityNameTranslationID: 'estimate.main.estStandardAllowancesCostCodeDetailDataService',
					httpRead: {
						route: globals.webApiBaseUrl + 'estimate/main/estallmarkup2costcode/', // adapt to web API controller
						endRead: 'getEstimateAllMarkup2CostCodeNew',
						usePostForRead: true,
						initReadData: function (readData) {
							let estimateMainService = $injector.get('estimateMainService');
							let allowance = estimateMainStandardAllowancesDataService.getSelected();
							let projectId = estimateMainService.getProjectId() ? estimateMainService.getProjectId() : 0;
							let estHeaderId = estimateMainService.getSelectedEstHeaderId() ? estimateMainService.getSelectedEstHeaderId() : 0;
							estHeaderFk = estHeaderId;
							readData.EstAllowanceFk = allowance.Id;
							readData.ProjectId = projectId;
							readData.EstHeaderId = estHeaderId;
							readData.isReturnCostCodes = allCostCodes.length <= 0;

							if(allowance.MdcAllowanceTypeFk === 3){
								let estAllowanceAreaFk =  $injector.get('estimateMainAllowanceAreaService').getSelected();
								readData.EstAllowanceAreaFk = estAllowanceAreaFk ? (estAllowanceAreaFk.Id > 0 ? estAllowanceAreaFk.Id : -2) : -1;
							}else {
								readData.EstAllowanceAreaFk = -1;
							}
							service.refreshColumns(gridId);
							return readData;
						}
					},
					httpCreate:{
						route: globals.webApiBaseUrl + 'estimate/main/estallmarkup2costcode/',
						endCreate:'create'
					},
					presenter: {
						tree: {
							parentProp: 'CostCodeParentFk',
							childProp: 'CostCodes',
							isInitialSorted: true,
							incorporateDataRead: function (readData, data) {
								return service.incorporateDataRead(readData, data);
							}
						}
					},
					dataProcessor: [estimateMainStandardMarkupAllowanceProcessor],
					entityRole: {
						node: {
							itemName: 'AllowanceMarkUp2CostCode',
							parentService: estimateMainAllowanceAreaService
						}
					},
					entitySelection: {supportsMultiSelection: true},
					actions: {
						delete: true,
						create: 'flat'
					}
				}
			};

			container = platformDataServiceFactory.createNewComplete(serviceOption);

			angular.extend(service, container.service);

			angular.extend(service, {
				setGridId:setGridId,
				getGridId:getGridId
			});

			service.createItem = function createItem() {
				let entity = $injector.get('estimateMainStandardAllowancesDataService').getSelected();
				$injector.get('estimateMainAllowanceCostCodeDetailAddServices').showDialog(entity,container.data);
			};


			service.incorporateDataRead = function incorporateDataRead(readData, data) {
				let context = {
					treeOptions:{
						parentProp: 'CostCodeParentFk',
						childProp: 'CostCodes'
					},
					IdProperty: 'CostCodeMainId'
				};

				if(!readData.dtos){
					readData.dtos = [];
				}

				totalEntity = readData.totalEntity;
				setTotalEntity(totalEntity);

				_.forEach(readData.dtos,function (item) {
					item.normalGcValue = item.GcValue;
				});

				if(readData.costCodes !== null){
					allCostCodes = [];
					cloudCommonGridService.flatten(readData.costCodes, allCostCodes, 'CostCodes');
				}

				let lookupData = estimateMainOnlyCostCodeAssignmentDetailLookupDataService.getFlattenDatas();
				if(!lookupData.length && readData.costCodes !== null){
					estimateMainOnlyCostCodeAssignmentDetailLookupDataService.setFlattenDatas(allCostCodes);
				}

				// set totalEntity readOnly
				let allFieldsReadOnly = [];
				_.forOwn(totalEntity, function (value, key) {
					if (key !== 'IsReadonly') {
						let field = {field: key, readonly: true};
						allFieldsReadOnly.push(field);
					}
				});
				runtimeDataService.readonly(totalEntity, allFieldsReadOnly);

				if(readData.dtos.length > 0){
					readData.dtos.unshift(readData.totalEntity);
				}

				platformDataServiceEntitySortExtension.sortTree(readData.dtos, 'CostCode', 'CostCodes');
				let dtos = $injector.get('basicsLookupdataTreeHelper').buildTree(angular.copy(readData.dtos), context);

				let result = container.data.handleReadSucceeded(dtos, data);

				platformDataServiceSelectionExtension.doSelectCloseTo(readData.dtos.length > 0 ? 1 : -1, container.data);

				return result;
			};

			service.setAllCostCodes = function setAllCostCodes(items){
				allCostCodes = angular.copy(items);
			};
			service.getAllCostCodes = function getAllCostCodes(){
				return allCostCodes;
			};

			function findParentNode(allCostCodes,currentCostCode,markup2CostcodeFks)
			{
				if(currentCostCode && !currentCostCode.CostCodeParentFk){
					return null;
				}

				if (markup2CostcodeFks.indexOf(currentCostCode.CostCodeParentFk)>=0){
					return  _.find(allCostCodes,{'Id':currentCostCode.CostCodeParentFk});
					// return parentNode1;
				}

				let parentNode = _.find(allCostCodes,{'Id':currentCostCode.CostCodeParentFk});
				return findParentNode(allCostCodes,parentNode,markup2CostcodeFks);
			}

			service.refreshGrid = function refreshGrid() {
				service.listLoaded.fire();
			};


			function setGridId(value) {
				gridId = value;
			}
			function getGridId() {
				return gridId;
			}

			service.updateSuccess = function updateSuccess (responseData){
				let updateTree = function updateTree(list) {
					_.forEach(list, function (oldItem) {
						let updatedItem = _.find(responseData, {Id: oldItem.Id});
						if (updatedItem) {
							oldItem.Version = updatedItem.Version;
						}
						if (oldItem.CostCodes) {
							updateTree(oldItem.CostCodes);
						}
					});
				};

				updateTree(container.data.itemTree);
			};

			service.updateMajorCostCode = function (currentAllowance) {
				let estimateMainService = $injector.get('estimateMainService');
				let projectId = estimateMainService.getProjectId() ? estimateMainService.getProjectId() : 0;
				let estHeaderId = estimateMainService.getSelectedEstHeaderId() ? estimateMainService.getSelectedEstHeaderId() : 0;
				let contextId = $injector.get('estimateMainCommonService').getCompanyContextFk();
				let parentCostCodes = _.filter(service.getList(),{'CostCodeParentFk' : -2});
				let parentFks = [];
				if(parentCostCodes.length > 0){
					_.forEach(parentCostCodes,function (d) {
						parentFks.push(d.CostCodeMainId);
					});
				}

				let httpRoute = globals.webApiBaseUrl + 'estimate/main/estallmarkup2costcode/updateMajorCostCode',
					postData = {
						MdcContextId:contextId,
						EstAllowanceFk:currentAllowance.Id,
						MarkupGa:currentAllowance.MarkUpGa,
						MarkupRp:currentAllowance.MarkUpRp,
						MarkupAm:currentAllowance.MarkUpAm,
						ProjectId:projectId,
						EstHeaderId:estHeaderId,
						estMarkupCostCodeIds:parentFks.length > 0 ? parentFks : null};

				if(currentAllowance.MdcAllowanceTypeFk === 3){
					let estAllowanceAreaFk =  $injector.get('estimateMainAllowanceAreaService').getSelected();
					postData.EstAllowanceAreaFk = estAllowanceAreaFk ? estAllowanceAreaFk.Id : -1;
				}else {
					postData.EstAllowanceAreaFk = -1;
				}


				$http.post(httpRoute,postData).then(function (response) {
					let items = response.data;
					allCostCodes = [];
					cloudCommonGridService.flatten(items.allCostCode, allCostCodes, 'CostCodes');
					estimateMainOnlyCostCodeAssignmentDetailLookupDataService.setFlattenDatas(allCostCodes);
					if (items.dto && items.dto.length) {
						_.forEach(items.dto, function (d) {
							d.CostCodeMainId = d.MdcCostCodeFk;
						});
						service.onCreateSucceeded(items.dto,true);
					}else {
						service.gridRefresh();
					}
					return items.dto;
				});
			};

			service.onCreateSucceeded = function onCreateSucceededInList(newItems,isUpdateMajorCostCode) {
				let data = container.data.itemList;

				let updateData = [];
				_.forEach(newItems,function (item) {
					item.normalGcValue = item.GcValue;
					let cd =_.find(data, {'CostCodeMainId': item.CostCodeMainId});
					if(!cd){
						updateData.push(item);
					}
				});
				if(!updateData.length){
					service.gridRefresh();
					if(gridId){
						platformGridAPI.rows.expandAllNodes(gridId);
					}
					service.setSelected(_.find(container.data.itemList,{CostCodeMainId:newItems[0].CostCodeMainId}));
					return;
				}

				_.forEach(data,function (d) {
					d.CostCodes = null;
				});
				data = data ? data : [];

				// container.data.doClearModifications(newItems,container.data);

				if(data.length) {
					totalEntity = _.find(data,{'CostCodeMainId': totalEntity.CostCodeMainId});

					_.forEach (updateData, function (d) {
						if(d.IsCustomProjectCostCode){
							d.MdcCostCodeFk = d.Project2MdcCstCdeFk;
						}

						totalEntity.DjcTotal = totalEntity.DjcTotal + d.DjcTotal;
						totalEntity.GcTotal = totalEntity.GcTotal + d.GcTotal;

						totalEntity.GaValue = totalEntity.GaValue + d.GaValue;
						totalEntity.GcValue = totalEntity.GcValue + d.GcValue;
						totalEntity.AmValue = totalEntity.AmValue + d.AmValue;
						totalEntity.RpValue = totalEntity.RpValue + d.RpValue;
						totalEntity.FmValue = totalEntity.FmValue + d.FmValue;
						totalEntity.AllowanceValue = totalEntity.AllowanceValue + d.AllowanceValue;

						totalEntity.DjcTotalOp = totalEntity.DjcTotalOp + d.DjcTotalOp;
						totalEntity.normalGcValue = totalEntity.normalGcValue + d.GcValue;

						container.data.itemList.push(d);
						service.markItemAsModified(d);
					});
				}else{
					setDefaultValutInTotal(totalEntity);
					_.forEach (updateData, function (d) {
						if(d.IsCustomProjectCostCode){
							d.MdcCostCodeFk = d.Project2MdcCstCdeFk;
						}
						totalEntity.DjcTotal = totalEntity.DjcTotal + d.DjcTotal;
						totalEntity.GcTotal = totalEntity.GcTotal + d.GcTotal;

						totalEntity.GaValue = totalEntity.GaValue + d.GaValue;
						totalEntity.GcValue = totalEntity.GcValue + d.GcValue;
						totalEntity.AmValue = totalEntity.AmValue + d.AmValue;
						totalEntity.RpValue = totalEntity.RpValue + d.RpValue;
						totalEntity.FmValue = totalEntity.FmValue + d.FmValue;
						totalEntity.AllowanceValue = totalEntity.AllowanceValue + d.AllowanceValue;

						totalEntity.DjcTotalOp = totalEntity.DjcTotalOp + d.DjcTotalOp;
						totalEntity.normalGcValue = totalEntity.normalGcValue + d.GcValue;

						container.data.itemList.push(d);
						service.markItemAsModified(d);
					});

					totalEntity.CostCodes = [];
					container.data.itemList.push(totalEntity);
				}

				if(data.length > 0){
					let costCodeFks = _.map(data,'CostCodeMainId');
					_.forEach(data,function (d) {
						let cd = _.find(allCostCodes,{'Id':d.CostCodeMainId});
						if(cd) {
							d.CostCodeMainId = cd.Id;
							d.CostCode = cd.Code;

							let parentNode = findParentNode (allCostCodes, cd, costCodeFks);
							if (parentNode) {
								d.CostCodeParentFk = parentNode.Id;
							}else {
								let parentCostCodeFk = _.find(costCodeFks,function (item) {
									return item === d.CostCodeParentFk;
								});
								d.CostCodeParentFk = parentCostCodeFk ? (parentCostCodeFk ? parentCostCodeFk : totalEntity.CostCodeMainId) : totalEntity.CostCodeMainId;
							}
						}
					});
				}

				let context = {
					treeOptions:{
						parentProp: 'CostCodeParentFk',
						childProp: 'CostCodes'
					},
					IdProperty: 'CostCodeMainId'
				};

				platformDataServiceEntitySortExtension.sortTree(data, 'CostCode', 'CostCodes');
				container.data.itemTree = [];
				container.data.itemTree =  $injector.get('basicsLookupdataTreeHelper').buildTree(data, context);

				prepareItems(container.data.itemTree);

				container.data.listLoaded.fire(null, container.data.itemList);

				if(gridId){
					platformGridAPI.rows.expandAllNodes(gridId);
				}

				if(isUpdateMajorCostCode){
					setUpdateMajorCostCodeSelected(data);
				}else {
					service.setSelected(_.find(container.data.itemList,{Id:newItems[0].Id}));
				}
			};

			function setUpdateMajorCostCodeSelected(data) {
				if(service.getSelected()){
					return;
				}
				let selected = data[0];
				service.setSelected(selected.Id === -2 ? data[1] : selected);
			}

			service.refreshData = function () {
				let estimateAllowancesDataService = $injector.get('estimateMainStandardAllowancesDataService');
				let IsExchangeHeader = estimateAllowancesDataService.getIsExchangeHeader();

				if(IsExchangeHeader){
					let EstAllowanceSelected = estimateAllowancesDataService.getSelected();
					if(!EstAllowanceSelected){
						totalEntity = {};
						allCostCodes = [];
						service.setList([]);
						container.data.itemList =[];
						container.data.itemTree =[];
						service.gridRefresh();
					}
					estimateAllowancesDataService.setIsExchangeHeader(false);
				}

				if(estHeaderFk === 0){
					totalEntity = {};
					allCostCodes = [];
					service.setList([]);
					container.data.itemList =[];
					container.data.itemTree =[];
					service.gridRefresh();
				} else {
					if(!platformGridAPI.grids.element('id', 'fec1963fae2e43f2815921ac04bcdff3')){
						let estimateMainService = $injector.get('estimateMainService');
						let currencyEstHeaderFk = estimateMainService.getSelectedEstHeaderId();

						if(estHeaderFk !== currencyEstHeaderFk){
							totalEntity = {};
							allCostCodes = [];
							service.setList([]);
							container.data.itemList =[];
							container.data.itemTree =[];
							service.gridRefresh();
							estHeaderFk = currencyEstHeaderFk;
						}
					}
				}
			};

			function setTotalEntity(totalEntity){
				totalEntity.AmPerc = null;
				totalEntity.AmPercConverted = null;
				totalEntity.FinM = null;
				totalEntity.FinMGc = null;
				totalEntity.FinMGra = null;
				totalEntity.FinMOp = null;
				totalEntity.GaPerc = null;
				totalEntity.GaPercConverted = null;
				totalEntity.GraPerc = null;
				totalEntity.RpPerc = null;
				totalEntity.RpPercConverted = null;
				totalEntity.normalGcValue = totalEntity.GcValue;
			}

			function setDefaultValutInTotal(totalEntity) {
				totalEntity.DjcTotal = 0;
				totalEntity.GcTotal = 0;

				totalEntity.GaValue = 0;
				totalEntity.GcValue = 0;
				totalEntity.AmValue = 0;
				totalEntity.RpValue = 0;
				totalEntity.FmValue = 0;
				totalEntity.AllowanceValue =0;
				totalEntity.DjcTotalOp = 0;
				totalEntity.normalGcValue = totalEntity.GcValue;
			}

			container.data.deleteEntities = function deleteChildEntities(entities) {
				let selectEntity = doPrepareDeleteInHierarchy(entities,container.data);
				setItemsToDelete (entities);
				updateTree();
				let context = {
					treeOptions:{
						parentProp: 'CostCodeParentFk',
						childProp: 'CostCodes'
					},
					IdProperty: 'CostCodeMainId'
				};

				if(container.data.itemList.length){
					container.data.itemTree = [];
					container.data.itemTree =  $injector.get('basicsLookupdataTreeHelper').buildTree(container.data.itemList, context);
				}

				container.data.listLoaded.fire(null, container.data.itemList);
				service.setSelected(selectEntity);
			};

			function setItemsToDelete(entities){
				let deleteEntity = [];
				let deleteMajorCostCode = _.filter(entities,function (entity) {
					return entity.CostCodeParentFk === -2;
				});

				let deleteChildEntity = _.filter(entities,function (entity) {
					return entity.CostCodeParentFk !== -2 && entity.Id !== -2;
				});

				if(deleteMajorCostCode.length){
					deleteEntity = asFlatList(deleteMajorCostCode);
				}

				if(deleteChildEntity.length){
					deleteEntity = deleteEntity.concat(deleteChildEntity);
				}

				deleteEntity = _.uniq(deleteEntity);

				let totalEntity = _.find(container.data.itemList, function (item) {
					return item.CostCodeParentFk === null;
				});

				_.forEach(deleteEntity,function (entity) {
					container.data.itemList = _.filter(container.data.itemList,function (d2) {
						return d2.Id !== entity.Id;
					});

					if(totalEntity.Id){
						totalEntity.DjcTotal = totalEntity.DjcTotal - entity.DjcTotal;
						totalEntity.GcTotal = totalEntity.GcTotal - entity.GcTotal;

						totalEntity.GaValue = totalEntity.GaValue - entity.GaValue;
						totalEntity.GcValue = totalEntity.GcValue - entity.GcValue;
						totalEntity.AmValue = totalEntity.AmValue - entity.AmValue;
						totalEntity.RpValue = totalEntity.RpValue - entity.RpValue;
						totalEntity.FmValue = totalEntity.FmValue - entity.FmValue;
						totalEntity.AllowanceValue = totalEntity.AllowanceValue - entity.AllowanceValue;

						totalEntity.DjcTotalOp = totalEntity.DjcTotalOp - entity.DjcTotalOp;
						totalEntity.normalGcValue = totalEntity.normalGcValue - entity.GcValue;
					}
				});

				if(container.data.itemList.length === 1){
					container.data.itemList =[];
					container.data.itemTree =[];
				}

				container.data.doClearModifications(deleteEntity,container.data);
				platformDataServiceModificationTrackingExtension.markEntitiesAsDeleted(service, deleteEntity, container.data);

			}

			function  updateTree() {
				let data = container.data.itemList;
				// update the data tree
				let costCodeFks = _.map(data,'MdcCostCodeFk');
				_.forEach(data,function (d) {
					d.CostCodes = null;
					let cd = _.find(allCostCodes,{'Id':d.MdcCostCodeFk});
					if(cd) {
						d.CostCodeMainId = cd.Id;
						d.CostCode = cd.Code;

						let parentNode = findParentNode (allCostCodes, cd, costCodeFks);
						if (parentNode) {
							d.CostCodeParentFk = parentNode.Id;
						}else {
							d.CostCodeParentFk = totalEntity.CostCodeMainId;
						}
					}
				});
			}

			function asFlatList(entities) {
				let flatten = [];
				container.data.flatten(entities, flatten, container.data.treePresOpt.childProp);

				return _.uniq(flatten);
			}

			function doPrepareDeleteInHierarchy(deleteParams, data) {
				let res = deleteParams.entity || null;
				if (!res && deleteParams && deleteParams.length > 0) {
					res = deleteParams[0];
				}

				if(!res || res.Id === -2){
					return null;
				}

				if(res.CostCodeParentFk === -2 && res.Id !== -2){
					let treeData = data.itemTree[0].CostCodes;
					let index = treeData.indexOf(res);

					return treeData.length - 1 === index ? treeData[index - 1] : treeData[index + 1];
				}

				let findData = _.find(data.itemList,{CostCodeMainId : res.CostCodeParentFk});

				if(findData.CostCodes.length && findData.CostCodes.length > 1){
					let index = findData.CostCodes.indexOf(res);
					if(index === findData.CostCodes.length -1){
						return findData.CostCodes[index - 1];
					}
					return  findData.CostCodes[index + 1];
				}

				return findData;
			}

			service.canDelete = function canDelete() {
				let items = service.getSelectedEntities();
				if(items.length === 0){
					return  false;
				}
				return !(items.length === 1 && items[0].Id === -2);
			};

			service.canCreate = function canCreate() {
				let item = estimateMainStandardAllowancesDataService.getSelected();
				if(item && item.MdcAllowanceTypeFk < 3){
					return !!item;
				}else {
					let areaItem = estimateMainAllowanceAreaService.getSelected();
					return areaItem ? (areaItem.AreaType <3 && areaItem.Id > 0) : false;
				}
			};

			service.afterSetSelectedEntities = new PlatformMessenger();
			let baseSetSelectedEntities = service.setSelectedEntities;
			service.setSelectedEntities = function setSelectedEntities(entities) {
				baseSetSelectedEntities(entities);
				service.afterSetSelectedEntities.fire();
			};

			service.afterclearContent = new PlatformMessenger();
			let clearContent = container.data.clearContent;
			container.data.clearContent = function clearTreeContent(data){
				clearContent(data);
				service.afterclearContent.fire();
			};


			service.clearData = function clearData() {
				allCostCodes = [];
				let data = container.data;
				if(data.itemList.length === 0){
					return;
				}
				data.itemList.length = 0;
				data.itemTree.length = 0;
				if (data.listLoaded) {
					data.listLoaded.fire();
				}
			};

			service.clearDataFromFavorites = function clearDataFromFavorites() {
				let estimateMainStandardAllowancesDataService = $injector.get('estimateMainStandardAllowancesDataService');
				if(estimateMainStandardAllowancesDataService.getIsClearMarkupContainer()){
					service.clearData();
					estimateMainStandardAllowancesDataService.setHeader(-1);
				}
			};

			container.data.doClearModifications = function doClearModificationsInNode(entity, data) {
				clearModificationsInNode(service,data,entity);
			};

			function clearModificationsInNode(service, data, entity) {
				let entities = modificationsAsArray(entity);
				entity = null;

				let modState = platformModuleStateService.state(service.getModule());
				let parentState = tryGetPath(modState.modifications, service.parentService());

				_.forEach(entities, function (entity) {
					if (parentState && entity && (parentState[data.itemName + 'ToSave'] || parentState[data.itemName + 'ToDelete'])) {
						if (_.find(parentState[data.itemName + 'ToSave'], {MainItemId: entity.Id})) {
							parentState[data.itemName + 'ToSave'] = _.filter(parentState[data.itemName + 'ToSave'], function (item) {
								return item.MainItemId !== entity.Id;
							});
							modState.modifications.EntitiesCount -= 1;
						}
						if (_.find(parentState[data.itemName + 'ToDelete'], {Id: entity.Id})) {
							parentState[data.itemName + 'ToDelete'] = _.filter(parentState[data.itemName + 'ToDelete'], function (item) {
								return item.Id !== entity.Id;
							});
							modState.modifications.EntitiesCount -= 1;
						}
					}
				});
			}

			function modificationsAsArray(input) {
				let entities;
				if (_.isArray(input)) {
					entities = input;
				} else {
					entities = [input];
				}

				return entities;
			}

			function tryGetPath(root, service) {
				let parentSrv = service.parentService();
				let elem = null;

				if (parentSrv) {
					elem = tryGetPath(root, parentSrv);

					if (elem) {
						elem = service.tryGetTypeEntries(elem);
					}
					if (elem) {
						elem = service.tryGetSelectedEntry(elem);
					}
				} else {
					elem = root;
				}

				return elem;
			}

			service.refreshColumns = function refreshColumns(grid,allowance) {
				let gridItem =platformGridAPI.grids.element('id', grid);
				if(!gridItem){
					return;
				}

				if(!gridItem.instance){
					return;
				}

				if(!allowance){
					allowance = $injector.get('estimateMainStandardAllowancesDataService').getSelected();
				}
				if(allowance){
					let column = resolveColumns(allowance);
					if(column){
						platformGridAPI.columns.configuration(grid, angular.copy(column));
						platformGridAPI.grids.refresh(grid);

						platformGridAPI.grids.onColumnStateChanged(grid);
						platformGridAPI.grids.invalidate(grid);
					}
				}
			};

			function resolveColumns(allowance) {
				let configurationColumn = platformGridAPI.columns.configuration(gridId);
				if(!allColumns.length){
					if(!configurationColumn){
						return;
					}
					allColumns = angular.copy(configurationColumn.current);
				}

				if(configurationColumn && allColumns.length === configurationColumn.current.length){
					allColumns = angular.copy(configurationColumn.current);
				}

				let columns = getLoadColumn(allowance);
				let cols = mergeWithViewConfig(gridId, columns);

				// bre:
				// The tree column (among others in BOQ tree) is a fix column which cannot be configured.
				// But in context with the "dynamic columns" the property 'treeColumn.hidden' sometimes is set to true,
				// then in the later call of function 'platformGridAPI.columns.configuration' the tree column disappears.
				// The following code repairs this defect.
				let treeColumn = _.find(cols, {id: 'tree'});
				if (treeColumn && treeColumn.hidden) {
					treeColumn.hidden = false;
				}

				return _.filter(cols, function (col) {
					return !_.isNil(col);
				});
			}

			function getLoadColumn(allowance) {
				let allowanceType = _.find($injector.get('estimateMainStandardAllowancesDataService').getAllowanceType(),{Id:allowance.MdcAllowanceTypeFk});

				if(allowanceType && allowance.IsOneStep){
					if(checkAllowanceType(allowanceType)){
						return findColumn(simpleOneStep);
					}
					return findColumn(MarkupOneStep);
				}

				if(allowanceType && !allowance.IsOneStep){
					if(checkAllowanceType(allowanceType)){
						return findColumn(simpleTwoStep);
					}
					return findColumn(MarkupTwoStep);
				}
			}

			function findColumn(column) {
				let loadColumn = [];
				_.forEach(column,function (d) {
					let findColumn = _.find(allColumns,function (item) {
						return item.id === d;
					});
					loadColumn.push(findColumn);
				});

				return loadColumn;
			}

			function checkAllowanceType(allowanceType) {
				return allowanceType.DescriptionInfo.Description.indexOf('Allowance') > -1 || allowanceType.DescriptionInfo.Description.indexOf('Area') > -1;
			}

			service.getAllColumns = function getAllColumns() {
				return allColumns;
			};


			function parseConfiguration(propertyConfig) {
				propertyConfig = angular.isString(propertyConfig) ? JSON.parse(propertyConfig) : angular.isArray(propertyConfig) ? propertyConfig : [];

				_.each(propertyConfig, function (config) {
					if (_.has(config, 'name')) {
						_.unset(config, 'name');
						_.unset(config, 'name$tr$');
						_.unset(config, 'name$tr$param$');
					}
				});

				return propertyConfig;
			}

			function mergeWithViewConfig(gridId, columns) {
				let isResourceContainer = false;
				let resourceShortKeyMap = {
					'estresourcetypefkextend' : 'estresourcetypeshortkey',
					'estresourcetypefkextendbrief' : 'estresourcetypeshortkeydescription'
				};

				if (gridId === 'bedd392f0e2a44c8a294df34b1f9ce44') {
					isResourceContainer = true;
				}

				if (!columns || !angular.isArray(columns)) {
					return [];
				}

				const columnsDic = {};

				// Add dynamic columns
				_.forEach(columns, function (item) {
					columnsDic[item.id] = item;
				});

				let defaultColumn = _.map(columns,'id');

				let allColumns = [];

				// Persist column order
				const config = mainViewService.getViewConfig(gridId);

				if (config) {
					let propertyConfig = config.Propertyconfig || [];
					propertyConfig = parseConfiguration(propertyConfig);

					_.forEach(propertyConfig, function (propertyItem) {

						let isOldResourceShortKeyField = isResourceContainer && resourceShortKeyMap[propertyItem.id];

						let propertyId = isOldResourceShortKeyField ? resourceShortKeyMap[propertyItem.id] : propertyItem.id;

						const col = columnsDic[propertyId];
						if (col) {
							const kb = col.keyboard ? col.keyboard : {enter: true, tab: true};

							col.hidden = !propertyItem.hidden; // property config hidden is reversed, so we take their opposite value
							col.pinned = propertyItem.pinned;
							col.userLabelName = propertyItem.userLabelName;
							col.keyboard = kb;
							col.width = propertyItem.width;
							col.aggregates = propertyItem.aggregates;

							if(isOldResourceShortKeyField){
								col.isOldResourceShortKeyField = isOldResourceShortKeyField;
							}

							allColumns.push(col);

							// Remove from cache dictionary
							delete columnsDic[propertyId];
						}
					});

					// const columnToAddToEnd = [];
					for (let item in columnsDic) {
						if (Object.prototype.hasOwnProperty.call(columnsDic, item)) {
							const columnAdd = columnsDic[item];
							if (columnAdd.id === 'indicator') {
								columnAdd.hidden = false;
								allColumns.unshift(columnAdd);
							} else if (columnAdd.id === 'marker' || columnAdd.id === 'group' || columnAdd.id === 'tree') {
								columnAdd.hidden = false;
								if(allColumns.length && allColumns[0].id === 'indicator') {
									allColumns.splice(1, 0, columnAdd);
								} else {
									allColumns.unshift(columnAdd);
								}
							}
							else if (columnAdd.forceVisible) {
								columnAdd.hidden = false;
								allColumns.push(columnAdd);
							} else {
								columnAdd.hidden = false;
								insertColumn(columnAdd,item);

							}
							// columnToAddToEnd.push(columnAdd);
						}
					}
					// allColumns = allColumns.concat(columnToAddToEnd);
				} else {
					allColumns = columns;
				}

				function insertColumn(columnAdd,item) {
					let index = 0;
					let lastId = null;
					while (defaultColumn[index] !== item) {
						lastId = defaultColumn[index];
						index = index+1;
					}
					if(index -1 < 0){
						allColumns.unshift(columnAdd);
					}else{
						if(lastId){
							let moveIndex = allColumns.length;

							let allColumnsDic = {};
							_.forEach(columns, function (item) {
								allColumnsDic[item.id] = item;
							});

							while (allColumnsDic[lastId].hidden && index > 0){
								index = index -1;
								lastId = defaultColumn[index];
							}

							let lastIdIndex = 1;
							while (allColumns[lastIdIndex].id !== lastId) {
								lastIdIndex = lastIdIndex+1;
							}

							while (moveIndex !== lastIdIndex){
								allColumns[moveIndex] = allColumns[moveIndex -1];
								moveIndex = moveIndex -1;
							}

							allColumns[lastIdIndex+1] = columnAdd;

						}
					}
				}

				return allColumns;
			}

			service.ReCalculateMarkup2costCodes = function (columnName) {
				let allowances = $injector.get('estimateMainStandardAllowancesDataService').getList();

				if(!allowances || !_.isArray(allowances)){
					return;
				}

				let allowanceEntity = $injector.get('estimateMainStandardAllowancesDataService').getSelected();

				if(!allowanceEntity){
					return;
				}
				let estMarkup2costCodes = service.getList();
				if(_.isArray(estMarkup2costCodes)){

					if(columnName === 'MarkUpGa'){
						_.forEach(estMarkup2costCodes,function (item) {
							if(item.Id !== -2){
								item.GaPerc = allowanceEntity.MarkUpGa;
							}
						});
					}

					if(columnName === 'MarkUpRp'){
						_.forEach(estMarkup2costCodes,function (item) {
							if(item.Id !== -2){
								item.RpPerc = allowanceEntity.MarkUpRp;
							}
						});
					}

					if(columnName === 'MarkUpAm'){
						_.forEach(estMarkup2costCodes,function (item) {
							if(item.Id !== -2){
								item.AmPerc = allowanceEntity.MarkUpAm;
							}
						});
					}

					let advancedAll = $injector.get('estimateMainContextDataService').getAdvancedAll();

					$injector.get('estimateMainMarkup2costcodeCalculationService').calculateMarkup2costCodes(allowanceEntity, estMarkup2costCodes, advancedAll);
					_.forEach(estMarkup2costCodes, function(item){
						service.markItemAsModified(item);
					});
					service.gridRefresh();
				}
			};

			function prepareItems(nodes, parentNode) {
				let n;
				let level = 0;
				if (parentNode) {
					level = parentNode.nodeInfo ? parentNode.nodeInfo.level + 1 : 0;
				}
				for (let i = 0; i < nodes.length; i++) {
					n = nodes[i];
					if (n.nodeInfo === undefined) {
						let nodeInfo = {
							level: level,
							collapsed: false,
							lastElement: false,
							children: !_.isNil(n['CostCodes']) && n['CostCodes'].length
						};
						n.nodeInfo = nodeInfo;
						n.HasChildren = !_.isNil(n['CostCodes']) && n['CostCodes'].length;
					}
					if (!_.isNil(n['CostCodes']) && n['CostCodes'].length > 0) {
						n.nodeInfo.lastElement = false;
						n.nodeInfo.children = true;
						n.HasChildren = true;
						n.nodeInfo.level = level;
						prepareItems(n['CostCodes'], n);
					} else {
						n.nodeInfo.lastElement = true;
						n.nodeInfo.children = false;
						n.HasChildren = false;
						n.nodeInfo.level = level;
					}
				}
			}
			container.data.usesCache = false;
			service.changeContainerHeaderTitle = new PlatformMessenger();

			container.data.filterParent = function (data) {
				data.currentParentItem = data.parentService.getSelected();
				data.selectedItem = null;
				if (data.currentParentItem && [1,2].indexOf(data.currentParentItem.AreaType) > -1) {
					return data.currentParentItem.Id;
				}else {
					return undefined;
				}
			};
			return service;
		}]
	);
})();
