/**
 * Created by jes on 9/7/2016.
 */
/* global globals */
(function (angular, globals) {
	'use strict';
	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).factory('constructionSystemMasterTestDataService', constructionSystemMasterTestDataService);

	constructionSystemMasterTestDataService.$inject = [
		'$http',
		'_',
		'$injector',
		'PlatformMessenger',
		'platformRuntimeDataService',
		'platformDataServiceFactory',
		'basicsLookupdataLookupDescriptorService',
		'constructionSystemMasterParameterTypeConverter',
		'ServiceDataProcessDatesExtension',
		'constructionsystemMasterScriptDataService',
		'basicsLookupdataLookupFilterService',
		'constructionSystemMasterHeaderService',
		'constructionSystemMasterParameterValidationHelperService'
	];

	/* jshint -W072 */
	function constructionSystemMasterTestDataService(
		$http,
		_,
		$injector,
		PlatformMessenger,
		platformRuntimeDataService,
		platformDataServiceFactory,
		basicsLookupdataLookupDescriptorService,
		parameterTypeConverter,
		ServiceDataProcessDatesExtension,
		constructionsystemMasterScriptDataService,
		basicsLookupdataLookupFilterService,
		constructionSystemMasterHeaderService,
		cosParameterValidationHelper
	) {

		var serviceOption = {
			hierarchicalLeafItem: {
				module: angular.module(moduleName),
				serviceName: 'constructionSystemMasterTestDataService',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'constructionsystem/master/testInput/',
					endRead: 'getalllist',
					initReadData: function (readData) {
						if(!readData.filter){
							var mainItemId = constructionSystemMasterHeaderService.getIfSelectedIdElse(0);
							readData.filter = '?mainItemId=' + mainItemId;
						}
					}
				},
				presenter: {
					tree: {
						parentProp: 'PId',
						childProp: 'ChildrenItem',
						incorporateDataRead: incorporateDataRead
					}
				},
				entityRole: {
					leaf: {
						itemName: 'CosParameter',
						parentService: constructionSystemMasterHeaderService,
						doesRequireLoadAlways: false
					}
				},
				actions: {
					'delete': false,
					'create': false
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
		var service = serviceContainer.service;
		var data = serviceContainer.data;

		// this function will be called in detail and grid controller before initDetailController() and initListController() get called
		// override service.registerSelectionChanged to not register loadCurrentItem() in detail-controller.service.js
		// in order to avoid recompile detail form at every selection change
		service.registerSelectionChanged2 = function (crtl) {
			if(crtl === 'detail') {
				return function doNothing() {};
			} else {
				return function registerSelectionChanged(callBackFn) {
					data.selectionChanged.register(callBackFn);
				};
			}
		};

		// override getTree() in data-service-data-present-extension.js
		// in order to filter the item that need to hide
		service.getTree = function getTree() {
			_.forEach(data.itemTree, function (tree) {
				if (tree.ChildrenItem && tree.ChildrenItem.length > 0) {
					tree.ChildrenItem = _.filter(tree.ChildrenItem, function (item) {
						if (item.__rt$data) {
							return item.__rt$data.hide === false || item.__rt$data.hide === undefined;
						} else {
							return true;
						}
					});
				}
			});
			return data.itemTree;
		};

		// private fields
		var _ParameterGroups = [];  // set onDataLoaded
		var _currentEntity = null;     // the entity for form detail, set onDataLoaded

		var lookupFilters = [
			{
				key: 'prjboqfk-for-construction-system-master-filter',
				serverSide: true,
				fn: function () {
					var formEntity = getCurrentEntity();
					var projectId = formEntity ? formEntity.ProjectFk : null;
					return projectId ? projectId.toString() : '-1';
				}
			},
			{
				key: 'constructionsystem-master-testinput-projectfk-filter',
				serverSide: true,
				fn: function (item) {
					return (item && item.ProjectFk) ? ('ProjectFk=' + (item.ProjectFk)) : null;
				}
			}
		];

		angular.extend(service, {
			registerLookupFilter: registerLookupFilter,
			unregisterLookupFilter: unregisterLookupFilter,
			getParameterList: getParameterList,
			getCurrentEntity: getCurrentEntity,
			execute: execute,
			execute2: execute2,
			canExecute: true,
			CosInsHeaderFkSelectionChanged: new PlatformMessenger(),
			ModelFkSelectionChanged: new PlatformMessenger(),
			getSelectedModelObjects: new PlatformMessenger(),
			scriptValidator: new PlatformMessenger(),
			getParameterGroups: function () {
				return _ParameterGroups;
			}
		});

		// to avoid register more than one handler in this messenger
		service.scriptValidator.count = 0;
		var register = service.scriptValidator.register;
		service.scriptValidator.register = function (fn) {
			if (service.scriptValidator.count === 0) {
				register(fn);
			}
			service.scriptValidator.count += 1;
		};
		var unregister = service.scriptValidator.unregister;
		service.scriptValidator.unregister = function (fn) {
			if (service.scriptValidator.count === 1) {
				unregister(fn);
			}
			service.scriptValidator.count -= 1;
		};

		service.registerListLoaded(generateCurrentEntity);
		service.registerItemModified(updateTestInput);

		constructionSystemMasterHeaderService.updatedDoneMessenger.register(service.load);
		cosParameterValidationHelper.validationInfoChanged.register(onValidationInfoChanged);
		constructionSystemMasterHeaderService.registerSelectionChanged(function () {
			_currentEntity = null;
		});

		return service;

		// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// public methods

		function getCurrentEntity() {
			if (!_currentEntity) {
				generateCurrentEntity();
			}
			var cosHeader = constructionSystemMasterHeaderService.getSelected();
			if (cosHeader) {
				if (cosHeader.Id !== _currentEntity.Id) {
					generateCurrentEntity();
				}
			}
			return _currentEntity;
		}

		function getParameterList() {
			return _.filter(service.getList(), function (item) {
				return item.ChildrenItem === null || item.ChildrenItem === undefined;
			});
		}

		function execute() {
			service.canExecute = false;
			var httpRoute = globals.webApiBaseUrl + 'constructionsystem/master/testInput/execute',
				testInputUpdateData = collectUpdateData();
			testInputUpdateData.Script = constructionsystemMasterScriptDataService.currentItem.ScriptData;
			constructionSystemMasterHeaderService.update().then(function () {

				var modelObjectService = $injector.get('constructionSystemMasterModelObjectDataService');
				modelObjectService.setSelectedObjects(testInputUpdateData.ModelObjectIds);

				$http.post(httpRoute, testInputUpdateData).then(function (response) {
					constructionsystemMasterScriptDataService.setExecutionResult(response.data);
					setCanExecute2Ture();
				}, setCanExecute2Ture);
			}, setCanExecute2Ture);
		}

		function execute2() {
			service.canExecute = false;
			var httpRoute = globals.webApiBaseUrl + 'constructionsystem/master/testInput/execute2',
				testInputUpdateData = collectUpdateData();
			testInputUpdateData.Script = constructionsystemMasterScriptDataService.currentItem.ScriptData;
			constructionSystemMasterHeaderService.update().then(function () {

				var modelObjectService = $injector.get('constructionSystemMasterModelObjectDataService');
				modelObjectService.setSelectedObjects(testInputUpdateData.ModelObjectIds);

				$http.post(httpRoute, testInputUpdateData).then(function (response) {
					constructionsystemMasterScriptDataService.setExecutionResult(response.data);
					setCanExecute2Ture();
				}, setCanExecute2Ture);
			}, setCanExecute2Ture);
		}

		function setCanExecute2Ture() {
			service.canExecute = true;
		}

		function onValidationInfoChanged(needToHide, validationInfo) {
			handleValidatorInfoForFormEntity(validationInfo);
			if (needToHide) {
				var parameters = getParameterList();
				_.forEach(needToHide, function (p) {
					var param = _.find(parameters, {VariableName: p.Name});
					if (param) {
						var treeChildren = _.find(data.itemTree, {Id: -param.CosParameterGroupFk});
						if(treeChildren && treeChildren.ChildrenItem) {
							if (_.find(treeChildren.ChildrenItem, {Id: param.Id}) === undefined) {
								treeChildren.ChildrenItem.push(param);
							}
						}
					}
				});
				_.forEach(data.itemTree, function (e) {
					if(e.ChildrenItem) {
						e.ChildrenItem = _.sortBy(e.ChildrenItem, function (c) {
							return c.Sorting;
						});
					}
				});
				data.listLoaded.fire(parameters);
			}
			service.gridRefresh();
		}

		function registerLookupFilter() {
			basicsLookupdataLookupFilterService.registerFilter(lookupFilters);
		}

		function unregisterLookupFilter() {
			basicsLookupdataLookupFilterService.unregisterFilter(lookupFilters);
		}


		// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// private methods

		function incorporateDataRead(readData, data) {
			/** @namespace readData.ParameterGroups */
			_ParameterGroups = readData.ParameterGroups;
			basicsLookupdataLookupDescriptorService.attachData(readData.ParameterValue || {});

			var dataSource = formatterData(readData);
			var list = data.handleReadSucceeded(dataSource || [], data);
			service.goToFirst();

			loadDataFromScript(getParameterList());

			var valueProcessor = itemProcessor();
			var dateProcessor = dateMomentProcess();
			_.forEach(getParameterList(), function (item) {
				valueProcessor.processItem(item);
				dateProcessor.processItem(item);
			});

			service.scriptValidator.fire();
			service.gridRefresh();
			return list;
		}

		function formatterData(readData) {
			var dataSource = [];
			if (readData && readData.ParameterGroups && readData.Parameters) {
				_.forEach(readData.ParameterGroups, function (group) {
					var parameters = _.filter(readData.Parameters, function (parameter) {
						return group.Id === parameter.CosParameterGroupFk;
					});

					if (parameters.length > 0) {
						_.forEach(parameters, function (item) {
							if (item.nodeInfo) {
								item.nodeInfo.collapsed = false;
							}
							else {
								item.nodeInfo = {
									collapsed: false,
									lastElement: true,
									level: 1
								};
							}
						});

						var parameterGroup = {
							Id: -group.Id,
							CosParameterGroupFk: null,
							UomFk: 0,
							PropertyName: null,
							VariableName: null,
							Value: null,
							IsLookup: true,
							CosParameterTypeFk: 0,
							DescriptionInfo: group.DescriptionInfo,
							ChildrenItem: parameters,
							nodeInfo: {
								collapsed: false,
								lastElement: false,
								level: 0
							}
						};
						platformRuntimeDataService.readonly(parameterGroup, [{field: 'Value', readonly: true}]);
						dataSource.push(parameterGroup);
					}
				});
			}
			return dataSource;
		}

		function collectUpdateData() {
			var testInputUpdateData = getCurrentEntity(),
				parameters = getParameterList(),
				parentItem = constructionSystemMasterHeaderService.getSelected();

			if (!testInputUpdateData || !parentItem) {
				return;
			}

			testInputUpdateData.ParameterList = parameters;
			testInputUpdateData.CosHeaderFk = parentItem.Id;

			var selectedModelObjects = service.getSelectedModelObjects.fire();
			if (angular.isArray(selectedModelObjects)) {
				testInputUpdateData.ModelObjectIds = selectedModelObjects.map(function (item) {
					return {
						ModelFk: item.ModelFk,
						Id: item.Id
					};
				});
			}

			return testInputUpdateData;
		}

		function updateTestInput() {
			var dataEntity = getCurrentEntity();
			var result = {
				ProjectFk: dataEntity.ProjectFk,
				EstHeaderFk: dataEntity.EstHeaderFk,
				CosInsHeaderFk: dataEntity.CosInsHeaderFk,
				ModelFk: dataEntity.ModelFk,
				PsdScheduleFk:dataEntity.PsdScheduleFk,
				BoqHeaderFk:dataEntity.BoqHeaderFk
			};

			_.forEach(getParameterList(), function (parameter) {
				result['m' + parameter.Id] = dataEntity['m' + parameter.Id].Value;
			});
			if (data.initialTestInput !== JSON.stringify(result)) {
				constructionsystemMasterScriptDataService.currentItem.TestInput = data.initialTestInput = JSON.stringify(result);
			}
		}

		function loadDataFromScript(parameters) {
			var oldData;
			try {
				oldData = JSON.parse(constructionsystemMasterScriptDataService.currentItem.TestInput);
			}
			catch (err) {
				oldData = {};
			}
			oldData = oldData || {};
			_.forEach(parameters, function (item) {
				if (Object.prototype.hasOwnProperty.call(oldData,'m' + item.Id)) {
					item.Value = oldData['m' + item.Id];
				}
			});
		}

		function dateMomentProcess() {
			return {
				processItem: function (item) {
					return new ServiceDataProcessDatesExtension(getDateFields()).processItem(item);
				},
				revertProcessItem: function (item) {
					return new ServiceDataProcessDatesExtension(getDateFields()).revertProcessItem(item);
				}
			};
		}

		function getDateFields() {
			var parameterList = getParameterList() || [],
				dateFileds = [];
			_.forEach(parameterList, function (item) {
				if ((item.IsLookup === false && item.CosParameterTypeFk === 11)) {
					dateFileds.push('m' + item.Id);
				}
			});
			return dateFileds;
		}

		function itemProcessor() {
			return {
				processItem: function processItem(item) {
					var lookupDataCache = basicsLookupdataLookupDescriptorService.getData('ParameterValue');
					if(item.IsLookup) {
						item.Value = Number(item.Value);
						item.DefaultValue = item.Value;
						var temp = (lookupDataCache && lookupDataCache[item.Value]) ? lookupDataCache[item.Value].ParameterValue : '';
						item.InputValue = parameterTypeConverter.convertValue(item.CosParameterTypeFk, temp);
					} else {
						item.Value = parameterTypeConverter.convertValue(item.CosParameterTypeFk, item.Value);
						item.DefaultValue = item.Value;
						item.InputValue = item.Value;
					}
				}
			};
		}

		function generateCurrentEntity() {
			if (!_currentEntity) {
				_currentEntity = {};
			}
			var  dataEntity = {
				Id: _currentEntity.Id ? _currentEntity.Id : -1,
				ProjectFk: _currentEntity.ProjectFk ? _currentEntity.ProjectFk : null,
				EstHeaderFk: _currentEntity.EstHeaderFk ? _currentEntity.EstHeaderFk : null,
				CosInsHeaderFk: _currentEntity.CosInsHeaderFk ? _currentEntity.CosInsHeaderFk : null,
				ModelFk: _currentEntity.ModelFk ? _currentEntity.ModelFk : null,
				PsdScheduleFk: _currentEntity.PsdScheduleFk ? _currentEntity.PsdScheduleFk : null,
				BoqHeaderFk: _currentEntity.BoqHeaderFk ? _currentEntity.BoqHeaderFk : null,
				__rt$data: _currentEntity.__rt$data ? _currentEntity.__rt$data : null
			};
			var cosHeader = constructionSystemMasterHeaderService.getSelected();
			if(cosHeader) {
				dataEntity.Id = cosHeader.Id;
			}
			_.forEach(getParameterList(), function (item) {
				dataEntity['m' + item.Id] = item;
			});
			_currentEntity = dataEntity;
		}

		function handleValidatorInfoForFormEntity(validationInfo) {
			var formEntity = getCurrentEntity();
			var parameters = getParameterList();
			_.forEach(parameters, function (param) {
				var model = 'm' + param.Id + '.Value';

				var vInfo = _.filter(validationInfo, function (info) {
					return param.VariableName === info.Name;
				});

				if (vInfo) {
					var errorInfo = _.filter(vInfo, function (info) {
						return Object.prototype.hasOwnProperty.call(info,'HasError') && info.HasError === true;
					});
					if (errorInfo.length === 0) {
						cosParameterValidationHelper.applyError({HasError: false}, formEntity, model); // no error at all, so clear previous error info if it exists
					} else {
						cosParameterValidationHelper.applyError(errorInfo[0], formEntity, model); // always apply the first one
					}

					var disableInfo = _.filter(vInfo, function (info) {
						return Object.prototype.hasOwnProperty.call(info,'IsDisabled');
					});
					_.forEach(disableInfo, function (info) {
						cosParameterValidationHelper.applyDisable(info, formEntity, model);
					});
				}
			});
		}
	}

})(angular, globals);
