/**
 * Created by lav on 14/05/2019.
 */
(function () {
	/*global angular*/
	'use strict';

	var moduleName = 'productionplanning.drawing';
	angular.module(moduleName).factory('productionplanningDrawingClobControllerService', [
		'platformPermissionService',
		'$http',
		'$rootScope',
		'$q',
		'platformCreateUuid',
		function (platformPermissionService,
				  $http,
				  $rootScope,
				  $q,
				  platformCreateUuid) {
			var service = {};
			var serviceCache = {};

			function getService(config) {
				var key = config.parentService.getServiceName();
				if (!serviceCache[key]) {
					serviceCache[key] = createService(config);
				}
				return serviceCache[key];
			}

			function createService(config) {
				var service = {};

				service.loadPartListById = function () {
					var defer = $q.defer();
					var entity = config.parentService.getSelected();
					if (entity && entity[config.foreignKey]) {
						if (entity.ClobToSave && config.enableCache) {
							service.cache.loadedItems[entity[config.foreignKey]] = entity.ClobToSave;
						}
						var item = config.enableCache ? service.cache.loadedItems[entity[config.foreignKey]] : null;
						if (item) {
							defer.resolve(item);
						} else {
							$http.get(globals.webApiBaseUrl + 'cloud/common/clob/getclobbyid?id=' + entity[config.foreignKey]).then(function (response) {
								if (response && response.data) {
									if (config.enableCache) {
										service.cache.loadedItems[entity[config.foreignKey]] = response.data;
									}
									defer.resolve(response.data);
								}
							});
						}
					} else {
						defer.resolve();
					}
					return defer.promise;
				};

				service.markItemAsModified = function (entity) {
					var parentEntity = config.parentService.getSelected();
					if (entity.Id === 0) {//deal with new entity
						entity.Id = 0; // platformCreateUuid();
						parentEntity[config.foreignKey] = entity.Id;
						service.cache.loadedItems[parentEntity[config.foreignKey]] = entity;
					}
					service.cache.modifiedItems[entity.Id] = entity;
					$rootScope.$emit('updateRequested', true);
					if (parentEntity.ClobToSave && parentEntity.ClobToSave.Version > entity.Version) {
						entity.Version = parentEntity.ClobToSave.Version;
					}
					parentEntity.ClobToSave = entity;
					config.parentService.markItemAsModified(parentEntity);
				};

				service.clearCache = function () {
					service.cache = {
						loadedItems: [],
						modifiedItems: []
					};
				};

				service.clearCache();

				service.getModifications = function () {
					return service.cache.modifiedItems;
				};

				return service;
			}

			service.initController = function ($scope, config) {
				var dataService = getService(config);
				var parentService = config.parentService;
				$scope.addTextComplement = null;
				$scope.selectTextComplement = null;
				$scope.editorOptions = {
					cursorPos: {
						get: null,
						set: null      // not yet supported!
					}
				};
				updatePartList();

				$scope.onTextChanged = function () {
					if (parentService.hasSelection()) {
						dataService.markItemAsModified($scope.specificationPlain);
					}
				};

				function isEditable() {
					if (config.readonly || !parentService.hasSelection()) {
						return false;
					} else {
						var permissionUuid = $scope.getContentValue('permission');
						return platformPermissionService.hasWrite(permissionUuid);
					}
				}

				function onSelectionChanged() {
					$scope.readonly = !isEditable();
					dataService.loadPartListById().then(function (data) {
						updatePartList(data);
					});
				}

				onSelectionChanged();

				parentService.registerSelectionChanged(onSelectionChanged);

				function refreshRequested() {
					dataService.clearCache();
				}

				config.mainService.registerRefreshRequested(refreshRequested);

				function updatePartList(currentPartList) {
					if (!currentPartList) {
						if (!currentPartList) {
							currentPartList = {
								Content: null,
								Id: 0,
								Version: 0
							};
						}
					}
					$scope.specificationPlain = currentPartList; // Set new partList object to scope
				}

				$scope.$on('$destroy', function () {
					parentService.unregisterSelectionChanged(onSelectionChanged);
					config.mainService.registerRefreshRequested(refreshRequested, true);
				});
			};

			service.decorateMainService = function (container) {
				container.service.registerRefreshRequested = function (fn, unRegister) {
					if (!unRegister) {
						container.data.refreshRequested.register(fn);
					} else {
						container.data.refreshRequested.unregister(fn);
					}
				};
			};

			return service;
		}
	]);
})();