/* globals angular */
(function (angular) {
	'use strict';
	basicsWorkflowSidebarRegisterService.$inject = ['basicsWorkflowModuleUtilService'];

	function basicsWorkflowSidebarRegisterService(basicsWorkflowModuleUtilService) {
		var service = {};

		var iEntityFacadeList = [];
		var entityDataFacadeList = [];

		service.registerEntityForModule = function (entityId, moduleName, isMainEntity, getFn, getListFn, prepareFn, refreshFn, getSelectedListFn, isOverride = false, entityName) {
			var existingItem = _.find(iEntityFacadeList, {entityId: entityId});

			if (existingItem) {
				existingItem.isMainEntity = isMainEntity;
				existingItem.moduleName = isOverride ? moduleName : existingItem.moduleName;
				existingItem.getFn = isOverride ? getFn : existingItem.getFn;
				existingItem.getListFn = getValidFn(existingItem.getListFn, getListFn);
				existingItem.prepareFn = getValidFn(existingItem.prepareFn, prepareFn);
				existingItem.updateFn = getValidFn(existingItem.updateFn, refreshFn);
				existingItem.getSelectedListFn = getValidFn(existingItem.getSelectedListFn, getSelectedListFn);
				existingItem.description = getValidFn(entityName, existingItem.description);
			} else {
				iEntityFacadeList.push({
					entityId: entityId,
					moduleName: moduleName,
					isMainEntity: isMainEntity,
					getFn: getFn,
					getListFn: getListFn,
					prepareFn: prepareFn,
					updateFn: refreshFn,
					getSelectedListFn: getSelectedListFn,
					description : entityName
				});
			}
		};

		service.registerDataEntityForModule = function (entityUUID, moduleSubmodule, containerUuid, updateFn, idPropertyNames, description) {
			var existingItem = _.find(entityDataFacadeList, {entityId: entityUUID});
			if (!existingItem) {
				entityDataFacadeList.push({
					entityId: entityUUID,
					moduleName: moduleSubmodule,
					containerUuid: containerUuid,
					description: description,
					getFn: function () {
						return basicsWorkflowModuleUtilService.createIdentObjects(idPropertyNames, basicsWorkflowModuleUtilService.getSelectedEntities(containerUuid))[0];
					},
					getListFn: function () {
						return basicsWorkflowModuleUtilService.createIdentObjects(idPropertyNames, basicsWorkflowModuleUtilService.getSelectedEntities(containerUuid));
					},
					prepareFn: _.noop,
					updateFn: function () {
						updateFn();
					},
					getSelectedListFn: function () {
						return basicsWorkflowModuleUtilService.createIdentObjects(idPropertyNames, basicsWorkflowModuleUtilService.getSelectedEntities(containerUuid));
					}
				});
			}
		};

		service.disableRefresh = function (entityId, refreshDisable) {
			var existingItem = _.find(iEntityFacadeList, {entityId: entityId});

			if (existingItem) {
				existingItem.refreshDisable = refreshDisable;
			} else {
				iEntityFacadeList.push({
					entityId: entityId,
					refreshDisable: refreshDisable
				});
			}
		};

		service.getEntitiesForModule = function (moduleName) {
			let facades = _.filter(iEntityFacadeList, {moduleName: moduleName});
			let dataFacades = service.getDataEntitiesForModule(moduleName);
			return facades.concat(dataFacades);
		};

		service.getDataEntitiesForModule = function (moduleSubmodule) {
			return _.filter(entityDataFacadeList, {moduleName: moduleSubmodule});
		};

		service.getFnsForEntity = function (entityId) {
			var facade = _.find(iEntityFacadeList, {entityId: entityId});
			return facade ? facade : _.find(entityDataFacadeList, {entityId: entityId});
		};

		return service;
	}

	function getValidFn(existingFn, newFn) {
		return newFn ? newFn : existingFn;
	}

	angular.module('basics.workflow')
		.factory('basicsWorkflowSidebarRegisterService', basicsWorkflowSidebarRegisterService)
		.run(['$rootScope', 'basicsWorkflowMasterDataService', 'basicsWorkflowSidebarRegisterService',
			'basicsWorkflowModuleUtilService', 'platformIsPreInitState', 'tokenAuthentication',
			function ($rootScope, basicsWorkflowMasterDataService, basicsWorkflowSidebarRegisterService, basicsWorkflowModuleUtilService, platformIsPreInitState, tokenAuthentication) {

				var unregisterDelegate = $rootScope.$on('$stateChangeSuccess', function () {
					var stateName = arguments[1].name;
					if (!platformIsPreInitState(stateName) && tokenAuthentication.isloggedIn()) {
						unregisterDelegate();
						basicsWorkflowMasterDataService.getEntities()
							.then(function (entities) {
								_.forEach(entities, function (item) {
									basicsWorkflowSidebarRegisterService.registerEntityForModule(item.Id,
										item.ModuleName,
										true, basicsWorkflowModuleUtilService.getCurrentItem,
										basicsWorkflowModuleUtilService.getCurrentList,
										angular.noop,
										basicsWorkflowModuleUtilService.refreshCurrentSelection,
										basicsWorkflowModuleUtilService.getCurrentSelectedList,
										false,
										item.EntityName
									);
								});
							});

						basicsWorkflowMasterDataService.getDataEntities().then(function (dataEntities) {
							_.forEach(dataEntities, function (item) {
								basicsWorkflowSidebarRegisterService.registerDataEntityForModule(item.Id,
									item.ModuleName,
									item.ContainerUuid,
									basicsWorkflowModuleUtilService.refreshCurrentSelection,
									item.IdPropertyNames,
									item.EntityName
								);
							});
						});
					}
				});
			}]);
})(angular);
