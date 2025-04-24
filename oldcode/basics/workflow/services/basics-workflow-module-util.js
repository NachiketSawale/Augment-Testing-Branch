/* globals _ */
(function (angular) {
	'use strict';

	function basicsWorkflowModuleUtilService($state, platformModuleStateService, cloudDesktopSidebarService, platformNavBarService, platformGridAPI) {
		var service = {};
		var moduleMap = {};

		_.each(globals.modules, function (m) {
			moduleMap[m.replace('.', '')] = m;
		});

		service.getCurrentModule = function getCurrentModule(currentState) {
			var module = currentState.name.split('.')[1];

			if (moduleMap.hasOwnProperty(module)) {
				module = moduleMap[module];
			} else {
				module = '';
			}
			return module;
		};

		service.refreshCurrentSelection = function () {
			var moduleState = platformModuleStateService.state(service.getCurrentModule($state.current));
			var rootService = moduleState.rootService;
			if (rootService && rootService.update) {
				var mainItem = moduleState.rootService.getSelected();
				var filterRequest = angular.copy(cloudDesktopSidebarService.filterRequest);
				rootService.update().then(function () {
					cloudDesktopSidebarService.filterRequest.pKeys = _.map(rootService.getList(), 'Id');
					var refreshFn = rootService.refreshSelectedEntities ? rootService.refreshSelectedEntities : rootService.refresh;
					refreshFn().then(function () {
						cloudDesktopSidebarService.filterRequest = filterRequest;
						if (mainItem) {
							var newEntity = moduleState.rootService.getItemById(mainItem.Id);
							rootService.setSelected(newEntity);
						}
					});
				});
			} else {
				var action = platformNavBarService.getActionByKey('refresh');
				if (angular.isFunction(action.fn)) {
					action.fn();
				}
			}
		};

		service.refreshAllCurrentEntities = function () {
			var moduleState = platformModuleStateService.state(service.getCurrentModule($state.current));
			var rootService = moduleState.rootService;
			if (rootService && rootService.update) {
				var filterRequest = angular.copy(cloudDesktopSidebarService.filterRequest);
				rootService.update().then(function () {
					const entities = rootService.getList();
					cloudDesktopSidebarService.filterRequest.pKeys = _.map(entities, 'Id');
					const refreshFn = rootService.refreshEntities ? rootService.refreshEntities : rootService.refresh;
					refreshFn(entities).then(function () {
						cloudDesktopSidebarService.filterRequest = filterRequest;
					});
				});
			} else {
				var action = platformNavBarService.getActionByKey('refresh');
				if (angular.isFunction(action.fn)) {
					action.fn();
				}
			}
		};

		service.getCurrentItem = function () {
			var moduleState = platformModuleStateService.state(service.getCurrentModule($state.current));
			var id;
			if (moduleState.rootService &&
				angular.isFunction(moduleState.rootService.getSelected) &&
				moduleState.rootService.getSelected()
			) {
				id = moduleState.rootService.getSelected().Id;
			}
			if (!id) {
				id = moduleState.selectedMainEntity ? moduleState.selectedMainEntity.Id : null;
			}
			return id;
		};

		/**
		 * returns the select item as object
		 * @returns {*}
		 */
		service.getCurrentItemObject = function () {
			var moduleState = platformModuleStateService.state(service.getCurrentModule($state.current));
			var obj;
			if (moduleState.rootService &&
				angular.isFunction(moduleState.rootService.getSelected) &&
				moduleState.rootService.getSelected()
			) {
				obj = moduleState.rootService.getSelected();
			}
			if (!obj) {
				obj = moduleState.selectedMainEntity ? moduleState.selectedMainEntity : null;
			}
			return obj;
		};

		service.getCurrentList = function () {
			var moduleState = platformModuleStateService.state(service.getCurrentModule($state.current));
			var ids = _.map(moduleState.mainEntities, 'Id');

			if (!ids.length) {
				if (moduleState.rootService && angular.isFunction(moduleState.rootService.getList)) {
					ids = _.map(moduleState.rootService.getList(), 'Id');
				}
			}

			return ids;
		};

		service.getCurrentSelectedList = function (gridId = null) {
			var moduleState = platformModuleStateService.state(service.getCurrentModule($state.current));
			var idList = [];

			if (_.isString(gridId) && !_.isEmpty(gridId)) {
				const flattenChildServices = function (item) {
					const childServices = !_.isNil(item) && _.isFunction(item.getChildServices) ? item.getChildServices() : [];
					return [item, _.flatMapDeep(childServices, flattenChildServices)];
				};
				const dataServiceList = _.flatMapDeep([moduleState.rootService], flattenChildServices);
				const dataServiceByGridId = _.find(dataServiceList, (ds) => _.isFunction(ds.hasUsingContainer) && ds.hasUsingContainer(gridId));
				if (dataServiceByGridId) {
					idList = _.map(dataServiceByGridId.getSelectedEntities(), 'Id');
				}
			} else if (moduleState.rootService &&
				angular.isFunction(moduleState.rootService.getSelectedEntities) &&
				moduleState.rootService.getSelected()
			) {
				idList = _.map(moduleState.rootService.getSelectedEntities(), 'Id');
			}

			return idList;
		};

		service.getCurrentOrSelectedItem = function (selected) {
			var items = null;
			if (angular.isArray(selected)) {
				items = _.map(selected, 'Id');
			} else {
				items = [selected.Id];
			}
			return items;
		};

		service.getSelectedEntities = function getSelectedEntities(containerUuid) {
			return platformGridAPI.rows.selection({
				gridId: containerUuid,
				wantsArray: true
			});
		};

		let selectedIdentObjects = [];
		service.createIdentObjects = function createIdentObjects(IdPropertyNames, selectedEntities = []) {

			let identObjectArr = [];
			selectedEntities.forEach(entity => {
				let identObject = {Id: entity.Id, Props: []};

				_.each(IdPropertyNames.filter(e => e !== 'Id'), function (idName, index) {
					let identName = 'PKey' + (index + 1);

					let prop = {
						PropName: idName,
						IdentName: identName,
						Value: entity[idName]
					};
					identObject.Props.push(prop);
				});
				identObjectArr.push(identObject);
			});

			if (!_.isEqual(selectedIdentObjects, identObjectArr)) {
				selectedIdentObjects = identObjectArr;
			}
			return selectedIdentObjects;
		};

		return service;
	}

	angular.module('basics.workflow')
		.factory('basicsWorkflowModuleUtilService', ['$state', 'platformModuleStateService', 'cloudDesktopSidebarService',
			'platformNavBarService', 'platformGridAPI', basicsWorkflowModuleUtilService]);

})(angular);
