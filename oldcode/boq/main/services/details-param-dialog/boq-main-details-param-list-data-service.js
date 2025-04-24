/**
 * Created by zos on 3/14/2018.
 */
(function (angular) {
	/* global globals, _ */
	'use strict';
	var moduleName = 'boq.main';
	/**
	 * @ngdoc service
	 * @name boqMainDetailsParamListDataService
	 * @function
	 *
	 * @description
	 * This service provides details formula parameter list Data Service for dialog.
	 */
	angular.module(moduleName).service('boqMainDetailsParamListDataService',
		['$q', '$http', '$injector', 'PlatformMessenger', 'platformDataServiceFactory', 'estimateMainCommonFeaturesService',
			'boqMainDetailsParamListValidationService', 'estimateParamUpdateService', 'estimateRuleParameterConstant', 'estimateRuleCommonService', 'estimateMainParamStructureConstant',
			function ($q, $http, $injector, PlatformMessenger, platformDataServiceFactory, estimateMainCommonFeaturesService,
				boqMainDetailsParamListValidationService, estimateParamUpdateService, estimateRuleParameterConstant, estimateRuleCommonService, estimateMainParamStructureConstant) {

				var service = {},
					data = [],
					selectedItem = null,
					assignedBoqItemEntity = null,
					itemsTOCache = [],
					_gridId = null;

				angular.extend(service, {
					getModule: getModule,
					getList: getList,
					clear: clear,
					clearCache: clearCache,
					setDataList: setDataList,
					getSelected: getSelected,
					setSelected: setSelected,
					refreshGrid: refreshGrid,
					gridRefresh: refreshGrid,
					createItem: createItem,
					deleteItem: deleteItem,
					setItemTOSave: setItemTOSave,
					getItemsTOCache: getItemsTOCache,
					registerListLoaded: registerListLoaded,
					unregisterListLoaded: unregisterListLoaded,
					registerSelectionChanged: registerSelectionChanged,
					unregisterSelectionChanged: unregisterSelectionChanged,
					setAssignedBoqItemEntity: setAssignedBoqItemEntity,
					getAssignedBoqItemEntity: getAssignedBoqItemEntity,
					listLoaded: new PlatformMessenger(),
					selectionChanged: new PlatformMessenger(),
					onUpdateList: new PlatformMessenger(),
					hasSelection: hasSelection,
					onItemChange: new PlatformMessenger(),
					getGridId: getGridId,
					setGridId: setGridId,
					UpdateParameter: updateParameter
				});

				var serviceOption = {
					module: angular.module(moduleName),
					entitySelection: {},
					modification: {multi: {}},
					translation: {
						uid: 'boqMainDetailsParamListDataService',
						title: 'Title',
						columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
						dtoScheme: { moduleSubModule: 'Boq.Main', typeName: 'BoqItemParamDto' }
					}
				};

				var container = platformDataServiceFactory.createNewComplete(serviceOption);
				container.data.itemList = [];
				angular.extend(service, container.service);

				function setAssignedBoqItemEntity(targetBoqItemEntity) {
					assignedBoqItemEntity = targetBoqItemEntity;
				}

				function getAssignedBoqItemEntity() {
					return assignedBoqItemEntity;
				}

				return service;

				function getModule() {
					return 'boq.main';
				}

				function getList() {
					return data;
				}

				function createItem(code) {

					var paramDialogService = $injector.get('estimateAssembliesDetailsParamDialogService');
					var config = paramDialogService.getConfigulation();
					var isDetailsFormulaParameters = $injector.get('boqMainCommonFeaturesService').getIsDetailsFormulaParameters();

					// server create
					var httpRoute = globals.webApiBaseUrl + 'estimate/parameter/lookup/create',
						creationData = {
							itemName: ['Boq'],
							item: config.entity
						};

					return $http.post(httpRoute, creationData).then(function (response) {
						var item = response.data.BoqParam;
						if (item && item.Id) {
							item.Code = code;
							item.Sorting = data.length + 1;
							var AssignedStructureId = estimateMainParamStructureConstant.BoQs;
							if (isDetailsFormulaParameters) {
								// /* if($injector.get('boqMainService').getCallingContextType() === 'Project') {
								//     AssignedStructureId = estimateMainParamStructureConstant.Project; //project
								// }else{
								//     AssignedStructureId = estimateMainParamStructureConstant.BasicCusizmeParam ;//basic customation parameter
								// }*/
								AssignedStructureId = estimateMainParamStructureConstant.Project; // project

							}
							item.AssignedStructureId = AssignedStructureId;
							addItems([item]);

							// need set AssignedStructureId again
							item.AssignedStructureId = AssignedStructureId;
							setSelected(item);
							updateSelection();
							service.onUpdateList.fire(data);
						}
						return item;
					});
				}

				function addItems(items) {
					data = data ? data : [];
					angular.forEach(items, function (item) {
						var matchItem = _.find(data, {Code: item.Code});
						if (!matchItem) {
							// var dialogService = $injector.get('boqMainDetailsParamDialogService');
							setItemTOSave(item);
							data.push(item);
						}
					});
					service.refreshGrid();
				}

				function deleteItem() {
					var selectedParams = service.getSelectedEntities();
					var targetBoqItem = service.getAssignedBoqItemEntity();
					if (selectedParams && selectedParams.length) {
						estimateParamUpdateService.setParamToDelete(selectedParams, targetBoqItem, 'boqMainService', 'Boq');
					}

					var ids = _.map(selectedParams, 'Id');
					data = _.filter(data, function (d) {
						return ids.indexOf(d.Id) <= -1;
					});

					var item = data.length > 0 ? data[data.length - 1] : null;
					service.setSelected(item);

					refreshGrid();
					updateSelection();
					service.onUpdateList.fire(data);

					angular.forEach(data, function (item) {
						boqMainDetailsParamListValidationService.validateCode(item, item.Code, 'Code');
					});
				}

				function setDataList(items) {
					if (Array.isArray(items)) {
						data = items;
					} else {
						data = [];
					}

					$injector.get('estimateMainDeatailsParamListProcessor').processItems(data);

					angular.forEach(data, function (item) {
						boqMainDetailsParamListValidationService.validateCode(item, item.Code, 'Code', 'listLoad');
					});

					// get the first time load data.
					if (itemsTOCache.length === 0) {
						itemsTOCache = angular.copy(data);
					}
				}

				function getSelected() {
					return selectedItem;
				}

				function setSelected(item) {
					var qDefer = $q.defer();
					selectedItem = item;
					qDefer.resolve(selectedItem);
					return qDefer.promise;
				}

				function hasSelection() {
					return selectedItem ? true : false;
				}

				function refreshGrid() {
					service.listLoaded.fire();
				}

				function updateSelection() {
					service.selectionChanged.fire();
				}

				function registerListLoaded(callBackFn) {
					service.listLoaded.register(callBackFn);
				}

				function unregisterListLoaded(callBackFn) {
					service.listLoaded.unregister(callBackFn);
				}

				function registerSelectionChanged(callBackFn) {
					service.selectionChanged.register(callBackFn);
				}

				function unregisterSelectionChanged(callBackFn) {
					service.selectionChanged.unregister(callBackFn);
				}

				function setItemTOSave(item) {
					var dialogService = $injector.get('boqMainDetailsParamDialogService');
					var sourceboqMainService = dialogService.getSourceBoqItemService();
					var selectedBoqItem = sourceboqMainService ? sourceboqMainService.getSelected() : {};
					estimateParamUpdateService.setParamToSave([item], selectedBoqItem, 'boqMainService', 'Boq');
				}

				function getItemsTOCache() {
					return itemsTOCache;
				}

				function clear() {
					selectedItem = null;
				}

				function clearCache() {
					itemsTOCache = [];
				}

				// var _gridId = null;

				function getGridId() {
					return _gridId;
				}

				function setGridId(gridId) {
					_gridId = gridId;
				}

				function updateParameter(item, col) {
					if (col === 'ValueDetail') {
						if (item.ValueType === estimateRuleParameterConstant.Text) {
							item.ParameterText = item.ValueDetail;
						} else {
							estimateRuleCommonService.calculateDetails(item, col, 'ParameterValue', service);
						}

					} else if (col === 'ParameterText') {
						if (item.ValueType !== estimateRuleParameterConstant.TextFormula) {
							item.ValueDetail = item.ParameterText;
						}

					} else if (col === 'ParameterValue') {
						item.ParameterValue = (item.ParameterValue === '') ? 0 : item.ParameterValue;
						estimateRuleCommonService.calculateDetails(item, col);
					}

					// check it here
					var currentEntity = $injector.get('boqMainDetailsParamDialogService').getCurrentEntity();
					if (currentEntity && currentEntity.ParamAssignment) {
						checkCodeConflict(currentEntity.ParamAssignment);
					}
				}

				function checkCodeConflict(displayData) {
					_.forEach(displayData, function (param) {
						$injector.get('estimateParameterComplexLookupValidationService').validateCode(param, param.Code, 'Code', displayData);
					});
				}

			}]);
})(angular);
