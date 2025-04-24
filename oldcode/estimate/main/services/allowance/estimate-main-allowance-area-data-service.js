(function(angular){
	/* global globals */
	'use strict';
	let module = angular.module('estimate.main');
	angular.module('estimate.main').factory('estimateMainAllowanceAreaService', ['_', '$injector', 'platformDataServiceFactory',
		'estimateMainStandardAllowancesDataService', 'estimateMainAllowanceAreaProcessor', 'estimateMainAllowanceAreaValueService',
		'estimateMainAllowanceAreaValueColumnGenerator', 'projectMainService', 'platformDataServiceDataProcessorExtension','platformDataServiceSelectionExtension',
		'platformDataServiceActionExtension','$translate', 'estimateMainFilterCommon', 'estimateMainFilterService', '$http', '$timeout', 'platformGridAPI', 'cloudCommonGridService',
		function(_, $injector, platformDataServiceFactory, estimateMainStandardAllowancesDataService, estimateMainAllowanceAreaProcessor,
			estimateMainAllowanceAreaValueService, estimateMainAllowanceAreaValueColumnGenerator, projectMainService,platformDataServiceDataProcessorExtension,platformDataServiceSelectionExtension,
			platformDataServiceActionExtension,$translate, estimateMainFilterCommon, estimateMainFilterService, $http, $timeout, platformGridAPI, cloudCommonGridService){
			let estAreaType = {
				NormalArea : 1,
				NormalRestArea: 2,
				GcArea: 3,
				GcRestArea: 4
			};
			let allFilterIds = [];

			let option = {
				hierarchicalNodeItem: {
					module: module,
					serviceName: 'estimateMainAllowanceAreaService',
					httpRead: {
						route: globals.webApiBaseUrl + 'estimate/main/allowancearea/',
						endRead: 'composite',
						initReadData: function initReadData(readData) {
							let selectedAllowance = estimateMainStandardAllowancesDataService.getSelected();
							readData.EstAllowanceFk = selectedAllowance ? selectedAllowance.Id : null;
							readData.projectId = projectMainService.getIfSelectedIdElse(0);
							readData.MdcAllowanceTypeFk = selectedAllowance ? selectedAllowance.MdcAllowanceTypeFk : -1;
							return readData;
						},
						usePostForRead: true
					},
					httpUpdate: {
						route: globals.webApiBaseUrl + 'estimate/main/allowancearea/',
						endUpdate: 'update'
					},
					httpCreate:{
						route: globals.webApiBaseUrl + 'estimate/main/allowancearea/',
						endCreate:'create'
					},
					httpDelete: {
						route: globals.webApiBaseUrl + 'estimate/main/allowancearea/',
						endDelete:'delete'
					},
					entitySelection: {
						supportsMultiSelection: false
					},
					setCellFocus: true,
					presenter: {
						tree: {
							parentProp: 'ParentFk',
							childProp: 'Children',
							incorporateDataRead: function incorporateDataRead(readData, data) {
								let areaStructures = readData.Areas === null ? [] : buildAreaTree(readData.Areas);
								if(readData.Areas !== null){
									handleMarkStatus(areaStructures.rootArea, data);
								}
								data.handleReadSucceeded(readData.Areas !== null ? [areaStructures.rootArea] : [], data);
								estimateMainAllowanceAreaValueService.setEntities(readData.Area2GcAreaValues);
								estimateMainAllowanceAreaValueColumnGenerator.refreshColumns();

								if(readData.Areas !== null){
									platformDataServiceSelectionExtension.doSelectCloseTo(2, data);
								}
							},
							initCreationData: function initCreationData(creationData){
								if(creationData.parent){
									switch (creationData.parent.AreaType){
										case 6:
											creationData.AreaType = 1;
											break;
										case 7:
											creationData.AreaType = 3;
											break;
									}
								}
							}
						}
					},
					actions:{
						create: 'hierarchical',
						canCreateCallBackFunc: canCreateArea,
						canCreateChildCallBackFunc: canCreateChildArea,
						delete: true,
						canDeleteCallBackFunc: canDeleteArea
					},
					dataProcessor: [estimateMainAllowanceAreaProcessor],
					entityRole: {
						node: {
							codeField: 'Code',
							itemName: 'AllowanceArea',
							moduleName: 'estimate.main',
							parentService: estimateMainStandardAllowancesDataService
						}
					}
				}
			};

			function isAreaWiseBalancing(){
				let allowanceSelected = estimateMainStandardAllowancesDataService.getSelected();
				return allowanceSelected && allowanceSelected.MdcAllowanceTypeFk === 3;
			}

			function canCreateArea(entity){
				return entity && [1,2,3,4].indexOf(entity.AreaType) > -1 && isAreaWiseBalancing();
			}

			function canCreateChildArea(entity){
				return entity && [6,7].indexOf(entity.AreaType) > -1&& isAreaWiseBalancing();
			}

			function canDeleteArea(entity){
				return entity && entity && [1,3].indexOf(entity.AreaType) > -1 && isAreaWiseBalancing();
			}

			function buildAreaTree(sourceAreaList){
				let selectedAllowance = estimateMainStandardAllowancesDataService.getSelected();

				let allowanceAreaChildren = _.filter(sourceAreaList, function(item){
					return [1,2].indexOf(item.AreaType) > -1;
				});

				_.forEach(allowanceAreaChildren, function(item){
					if(item.AreaType === 2){
						item.Code = $translate.instant('estimate.main.areaCode.restCode');
					}
					item.ParentFk = -2;
				});

				let AllowanceArea = {
					Id : -2,
					EstAllowanceFk : selectedAllowance ? selectedAllowance.Id : null,
					Code : $translate.instant('estimate.main.areaCode.allowanceAreaCode'),
					Description:{
						Description: '',
						Translated:''
					},
					AreaType : 6,
					DjcTotal : _.sum(_.map(allowanceAreaChildren, 'DjcTotal')),
					GcTotal : _.sum(_.map(allowanceAreaChildren, 'GcTotal')),
					ParentFk : -1,
					Children : allowanceAreaChildren
				};

				let gcAreaChildren = _.filter(sourceAreaList, function(item){
					return [3,4].indexOf(item.AreaType) > -1;
				});

				_.forEach(gcAreaChildren, function(item){
					if(item.AreaType === 4){
						item.Code = $translate.instant('estimate.main.areaCode.restCode');
					}
					item.ParentFk = -3;
				});

				let gcArea = {
					Id : -3,
					EstAllowanceFk : selectedAllowance ? selectedAllowance.Id : null,
					Code : $translate.instant('estimate.main.areaCode.gcAreaCode'),
					Description:{
						Description: '',
						Translated:''
					},
					AreaType : 7,
					DjcTotal : 0,
					GcTotal : _.sum(_.map(gcAreaChildren, 'GcTotal')),
					ParentFk : -1,
					Children : gcAreaChildren
				};

				let rootArea = {
					Id : -1,
					EstAllowanceFk : selectedAllowance ? selectedAllowance.Id : null,
					Code : $translate.instant('estimate.main.root'),
					Description:{
						Description: '',
						Translated:''
					},
					AreaType : 5,
					DjcTotal : AllowanceArea.DjcTotal,
					GcTotal : AllowanceArea.GcTotal,
					ParentFk : null,
					Children : [AllowanceArea, gcArea]
				};

				return {
					rootArea:rootArea,
					normalArea:AllowanceArea,
					gcArea:gcArea
				};
			}

			let container = platformDataServiceFactory.createNewComplete(option);

			container.data.newEntityValidator = $injector.get('estimateMainAllowanceAreaValidationService');

			let service = container.service;

			function generateUpdateDoneFunc(container){
				let dataService = container.data;
				return function handleUpdateDone(updateData, response, data){
					if(response.AllowanceAreaToSave){
						let areaToAdd = [];
						let boqAreaAssigmentToSave = [];
						angular.forEach(response.AllowanceAreaToSave, function (item) {
							let area = item.AllowanceArea;
							if(area){
								let oldItem = _.find(dataService.itemList, {Id: area.Id});

								if (oldItem) {
									dataService.mergeItemAfterSuccessfullUpdate(oldItem, area, true, dataService);
									platformDataServiceDataProcessorExtension.doProcessItem(oldItem, dataService);
								}else{
									areaToAdd.push(area);
								}
							}

							if(item.BoqAreaAssigmentToSave){
								boqAreaAssigmentToSave = boqAreaAssigmentToSave.concat(item.BoqAreaAssigmentToSave);
							}
						});

						if(boqAreaAssigmentToSave.length > 0){
							$injector.get('estimateMainAllowanceBoqAreaAssigmentService').handleUpdateDone(boqAreaAssigmentToSave, response, data);
						}

						if(areaToAdd.length > 0){
							let areaStructures = buildAreaTree(areaToAdd);
							dataService.handleReadSucceeded([areaStructures.rootArea], dataService);
							estimateMainAllowanceAreaValueColumnGenerator.refreshColumns();
						}

					}
				};
			}

			service.handleUpdateDone = generateUpdateDoneFunc(container);

			// add updateData when create markup cost code
			container.data.forceNodeItemCreation = true;

			container.data.handleOnCreateSucceeded = function handleOnCreateSucceededInTree(newItem, data) {
				var newItems = [];
				data.flatten([newItem], newItems, data.treePresOpt.childProp);
				_.forEach(newItems, function (item) {
					platformDataServiceDataProcessorExtension.doProcessItem(item, data);
					data.itemList.push(item);
				});
				data.itemList = _.sortBy (data.itemList, ['AreaType', 'Id']);
				platformDataServiceActionExtension.fireEntityCreated(data, newItem);
				updateTree(data.itemList);

				return platformDataServiceSelectionExtension.doSelect(newItem, data).then(
					function () {
						if (data.newEntityValidator) {
							data.newEntityValidator.validate(newItem, container.service);
						}
						data.markItemAsModified(newItem, data);
						return newItem;
					},
					function () {
						data.markItemAsModified(newItem, data);
						return newItem;
					}
				);
			};

			function updateTree(data) {
				let context = {
					treeOptions:{
						parentProp: 'ParentFk',
						childProp: 'Children',
					},
					IdProperty: 'Id'
				};
				let result = [];
				result = $injector.get('basicsLookupdataTreeHelper').buildTree(data, context);
				_.forEach(result[0].Children,function (item) {
					item.Children = _.sortBy (item.Children, ['AreaType', 'Id']);
				});

				container.data.itemTree = [];
				container.data.itemTree = result;
				container.data.listLoaded.fire(null, container.data.itemList);
			}

			let originalOnDeleteDone = container.data.onDeleteDone;

			container.data.onDeleteDone = function onDeleteDone(deleteParams, data, response) {
				let isHasGcArea = false;
				let estimateMainAllowanceAreaValueColumnGenerator = $injector.get('estimateMainAllowanceAreaValueColumnGenerator');
				if(deleteParams.entities && deleteParams.entities.length){
					_.forEach(deleteParams.entities,function (item) {
						if(item.AreaType === estAreaType.GcArea){
							// refresh column
							isHasGcArea = true;
							estimateMainAllowanceAreaValueColumnGenerator.deleteAreaValueColumns(item, true);
						}else if(item.AreaType === estAreaType.NormalArea){
							// reCalculateRest
							estimateMainAllowanceAreaValueColumnGenerator.deleteAreaValueColumns(item, false);
						}
					});
				}

				if(isHasGcArea){
					estimateMainAllowanceAreaValueColumnGenerator.refreshConfigurationColumn();
				}

				originalOnDeleteDone(deleteParams, data, response);
			};

			service.clearData = function clearData() {
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

			service.clearDataFromFavorites = function () {
				let estimateMainStandardAllowancesDataService = $injector.get('estimateMainStandardAllowancesDataService');
				if(estimateMainStandardAllowancesDataService.getIsClearMarkupContainer()){
					service.clearData();
					estimateMainStandardAllowancesDataService.setHeader(-1);
				}
			}

			service.markersChanged = function markersChanged(itemList) {
				let filterKey = 'EST_ALL_AREA';
				let filterKeyIds = 'EST_ALL_AREA_IDS';
				let filterAreaId = 'estimateMainAllowanceAreaController';

				if (_.isArray(itemList) && _.size(itemList) > 0) {
					allFilterIds = [];
					_.each(itemList, function (item) {
						let Ids = _.map(estimateMainFilterCommon.collectItems(item, 'Children'), 'Id');
						allFilterIds = allFilterIds.concat(Ids);
					});

					allFilterIds = Array.from(new Set(allFilterIds));
					estimateMainFilterService.setFilterIds(filterKeyIds, angular.copy(allFilterIds), true);

					// the filter button of tool still disable in the first time
					let allFilterKeyObj = estimateMainFilterService.getFilterObjects();
					if(!Object.hasOwnProperty.call(allFilterKeyObj, filterAreaId)){
						allFilterKeyObj[filterAreaId] = {
							toolbarItemId: filterAreaId,
						};
					}

					$http.post(globals.webApiBaseUrl + 'estimate/main/allowancearea/getAllBoqIdsInArea', handleRequestParamForMarkers(allFilterIds)).then(function(response) {
						if (response && response.data) {
							allFilterIds = response.data;

							estimateMainFilterService.setFilterIds(filterKey, allFilterIds);
							estimateMainFilterService.addFilter(filterAreaId, service, function (lineItem) {
								return allFilterIds.indexOf(lineItem.BoqItemFk) >= 0;
							}, { id: filterKey, iconClass: 'tlb-icons ico-filter-boq-allowance-area', captionId: 'filterBoqArea'}, 'BoqItemFk');
						}
					});

				} else {
					estimateMainFilterService.setFilterIds(filterKey, []);
					estimateMainFilterService.setFilterIds(filterKeyIds, [], true);
					estimateMainFilterService.removeFilter(filterAreaId);
				}
			};

			function handleMarkStatus(rootArea) {
				let multiSelect = service.getMultiSelectStatus();

				let filterKeyIds = 'EST_ALL_AREA_IDS';
				let filterIds = estimateMainFilterService.getAllFilterIds();
				if (filterIds[filterKeyIds] && _.isArray(filterIds[filterKeyIds])) {
					let flatList = cloudCommonGridService.flatten([rootArea], [], 'Children');
					let filterItem = _.filter(flatList, function (item) {
						return (multiSelect ? _.includes(filterIds[filterKeyIds], item.Id) : item.Id === filterIds.EST_ALL_AREA_IDS[0]);
					});

					if (filterItem && _.isArray(filterItem) && filterItem[0]) {
						// IsMarked used by the UI config service as filter field
						_.each(filterItem, function (item) {
							item.IsMarked = true;
						});

						let grids = container.data.usingContainer;
						_.each(grids, function (gridId) {
							if (gridId) {
								$timeout(function () {
									platformGridAPI.rows.scrollIntoViewByItem(gridId, filterItem[0]);
									service.setSelected(filterItem[0]);
								});
							}
						});
					}
				}
			}

			service.getMultiSelectStatus = function () {
				let data = container.data;
				let multiSelect = false;
				if (data.usingContainer && data.usingContainer[0]) {
					let existedGrid = platformGridAPI.grids.exist(data.usingContainer[0]);
					if (existedGrid) {
						let columns = platformGridAPI.columns.getColumns(data.usingContainer[0]);
						let markerColumn = _.find(columns, {'field': 'IsMarked'});
						if (markerColumn && markerColumn.editorOptions) {
							multiSelect = markerColumn.editorOptions.multiSelect;
						}
					}
				}
				return multiSelect;
			}

			function handleRequestParamForMarkers(filterIds) {
				let data = service.getList();
				let normalRestArea = _.find(data, {AreaType: estAreaType.NormalRestArea});
				let gcRestArea = _.find(data, {AreaType: estAreaType.GcRestArea});
				let selectedAllowance = estimateMainStandardAllowancesDataService.getSelected();

				let requestData = {
					FilterAreaIds: filterIds,
					ProjectId: $injector.get('estimateMainService').getProjectId(),
					EstAllowanceFk: selectedAllowance ? selectedAllowance.Id : null
				};
				_.forEach(filterIds, function (item) {
					if(item === normalRestArea.Id){
						requestData.NormalRestAreaId = item;
					}
					if(item === gcRestArea.Id){
						requestData.GcRestAreaId = item;
					}
				});

				return requestData;
			}

			return service;
		}]);
})(angular);