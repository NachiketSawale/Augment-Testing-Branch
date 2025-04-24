
(function () {
	/*global angular, globals*/
	'use strict';

	var moduleName = 'productionplanning.configuration';
	angular.module(moduleName).factory('productionplanningConfigurationClobControllerService', [
		'platformPermissionService',
		'$http',
		'$rootScope',
		'$q',
		'platformCreateUuid',
		'ppsExternalDefaultConfigConstantValues',
		function (platformPermissionService,
			$http,
			$rootScope,
			$q,
			platformCreateUuid,
			ppsExternalDefaultConfigConstantValues) {
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

				service.loadPartListById = function (dropdownItemChanged) {
					var defer = $q.defer();
					var entity = config.parentService.getSelected();

					if (entity) {
						let item = config.enableCache ? service.cache.loadedItems[entity[config.foreignKey]] : {
							Content: null,
							Id: 0,
							Version: 0
						};

						if (entity[config.foreignKey] && !service.cache.loadedItems[entity[config.foreignKey]]) {
							$http.get(globals.webApiBaseUrl + 'cloud/common/clob/getclobbyid?id=' + entity[config.foreignKey]).then(function (response) {
								if (response && response.data) {
									if (config.enableCache) {
										item = response.data;
										setExternalCofiguration(entity, item, defer, dropdownItemChanged);
									}
									defer.resolve(response.data);
								}
							});
						} else {
							setExternalCofiguration(entity, item, defer, dropdownItemChanged);
							defer.resolve(item);
						}
					} else {
						defer.resolve();
					}
					return defer.promise;
				};

				function setExternalCofiguration(entity, item, defer, dropdownItemChanged) {
					if (dropdownItemChanged) {
						if (entity.BasExternalSourceTypeFk === 11 || entity.BasExternalSourceTypeFk === 21 || entity.BasExternalSourceTypeFk === 25) {
							item = getExternalSourceTypeDefaultConfig(entity, item);
							service.cache.loadedItems[entity[config.foreignKey]] = item;
						} else {
							item.Content = '';
							service.cache.loadedItems[entity[config.foreignKey]] = item;
						}
					}
					if (entity.ClobToSave) {
						entity.ClobToSave.Content = item.Content;
					}
					if (item) {
						if (config.enableCache) {
							service.cache.loadedItems[entity[config.foreignKey]] = item;
						}
						defer.resolve(item);
					}
				}


				function getExternalSourceTypeDefaultConfig(entity, item) {
					let loadedConfig = null;

					let constantConfig = {
						Id: entity.BasClobsFk ? entity.BasClobsFk : 0,
						Content: null,
						Version: item ? item.Version : 0
					};

					if (entity.ClobToSave) {
						constantConfig = entity.ClobToSave;
					}

					switch (entity.BasExternalSourceTypeFk) {
						case 11:
							constantConfig.Content = JSON.stringify(ppsExternalDefaultConfigConstantValues.mesDefaultConfig, null, 2);
							break;
						case 21:
							constantConfig.Content = JSON.stringify(ppsExternalDefaultConfigConstantValues.timPrecastConfig, null, 2);
							break;
						case 25:
							constantConfig.Content = JSON.stringify(ppsExternalDefaultConfigConstantValues.stockyardAppDefaultConfig, null, 2);
							break;
						default:
							break;
					}
					if (config.enableCache) {
						service.cache.loadedItems[entity[config.foreignKey]] = loadedConfig = constantConfig;
					}
					return loadedConfig;
				}

				service.markItemAsModified = function (entity) {
					if (entity.Version === 0 && entity.Content === null) {
						return;
					}
					var parentEntity = config.parentService.getSelected();

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

				function onDropdownItemChanged(a, item) {
					if (parentService.hasSelection() && item && item.dropdownItemChanged) {
						dataService.loadPartListById(true).then(function (data) {
							updatePartList(data);
							dataService.markItemAsModified($scope.specificationPlain);
						});
					}
				}

				onSelectionChanged();

				parentService.registerSelectionChanged(onSelectionChanged);
				parentService.registerItemModified(onDropdownItemChanged);

				function refreshRequested() {
					dataService.clearCache();
				}

				config.mainService.registerRefreshRequested(refreshRequested);

				function updatePartList(currentPartList) {

					if (!currentPartList) {
						currentPartList = {
							Content: null,
							Id: 0,
							Version: 0
						};
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