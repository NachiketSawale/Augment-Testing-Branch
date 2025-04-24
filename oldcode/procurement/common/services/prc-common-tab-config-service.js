(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	angular.module('procurement.common').factory('procurementCommonTabConfigService',
		['mainViewService', '$http', '$q', '$rootScope', 'basicsLookupdataLookupDescriptorService',
			function (mainViewService, $http, $q, $rootScope, lookupDescriptorService) {

				var service = {};
				var configCache = {};
				var mainDataService;
				var lastConfig = {};
				var currentModuleName;
				var needToggleTabState = true;
				var shouldUpdate = false;
				var onStateChangeWatch = null;

				function getProcurementConfiguration(moduleName, item) {
					if (!item) {
						return null;
					}

					if (moduleName === 'procurement.quote') {
						let currentQuote = mainDataService.parentService().getSelected();
						return currentQuote.PrcConfigurationFk;
					} else if (Object.prototype.hasOwnProperty.call(item, 'PrcHeaderEntity')) {
						return item.PrcHeaderEntity.ConfigurationFk;
					} else if (Object.prototype.hasOwnProperty.call(item, 'PrcConfigurationFk')) {
						return item.PrcConfigurationFk;
					} else if (Object.prototype.hasOwnProperty.call(item, 'ConfigurationFk')) {
						return item.ConfigurationFk;
					}

					return null;
				}

				function loadTabConfig(moduleName, item) {
					var configId = getProcurementConfiguration(moduleName, item);
					if (!configId) {
						return $q.when({});
					}

					var qDefer = $q.defer();

					// Already cached
					if (configCache[configId]) {
						return $q.when(configCache[configId]);
					} else {
						$http.get(globals.webApiBaseUrl + 'basics/procurementconfiguration/configuration2tab/list', {
							params: {
								moduleName: moduleName,
								configId: configId
							}
						}).then(function success(response) {

							var tabConfigs = {};
							angular.forEach(response.data, function (tabConfig) {

								if (tabConfig.IsDisabled) {
									tabConfigs[tabConfig.ModuleTabFk] = 'disabled';
								} else {
									switch (tabConfig.Style) {
										case 2: // High Lighted
											tabConfigs[tabConfig.ModuleTabFk] = '.highlight';
											break;
										case 3: // gray out
											tabConfigs[tabConfig.ModuleTabFk] = '.gray-out';
											break;
									}
								}
							});

							configCache[configId] = tabConfigs;
							qDefer.resolve(tabConfigs);
						});
					}

					return qDefer.promise;
				}

				// noinspection JSUnusedLocalSymbols
				function onCurrentConfigChanged(e, item) {

					loadTabConfig(currentModuleName, item).then(
						function (config) {
							if ((config !== lastConfig && needToggleTabState) || shouldUpdate) {
								mainViewService.toggleTabState(angular.copy(config));
								setTabStatusChange(config);
								lastConfig = config;
								shouldUpdate = false;
							}
						}
					);
				}

				function setTabStatusChange(config) {
					setTimeout(function () {
						_.forEach(config, function (value, key) {
							var tabEle = angular.element('#tab_' + key);
							if (tabEle.hasClass('highlight')) {
								tabEle.removeClass('highlight');
							}
							if (tabEle.hasClass('gray-out')) {
								tabEle.removeClass('gray-out');
							}
							if (value.indexOf('.') === 0) {
								angular.element('#tab_' + key).addClass(value.substr(1));
							}
						});
					}, 50);
				}

				function onTabChanged(e, args) {

					if (!e || !args) {
						return;
					}
					needToggleTabState = !(e.name === '$stateChangeStart' && args.toTab === 0 && args.fromTab === 0);

					setTabStatusChange(lastConfig);

				}

				mainViewService.registerListener('onTabChanged', onTabChanged);

				service.registerTabConfig = function (moduleName, mainService) {

					currentModuleName = moduleName;
					mainDataService = mainService;

					var mainSelected = mainDataService.getSelected();
					if (mainSelected && mainSelected.Id) {
						onCurrentConfigChanged(null, mainSelected);
					}

					mainDataService.registerSelectionChanged(onCurrentConfigChanged);
					mainDataService.registerItemModified(onCurrentConfigChanged);
					mainViewService.registerListener('onlayoutEdit', onLayoutEdit);
				};

				service.unregisterTabConfig = function () {
					configCache = {};
					lastConfig = {};
					mainDataService.unregisterSelectionChanged(onCurrentConfigChanged);
					mainDataService.unregisterItemModified(onCurrentConfigChanged);
					mainViewService.unregisterListener('onlayoutEdit', onLayoutEdit);
				};

				function onLayoutEdit() {
					onStateChangeWatch = $rootScope.$on('$stateChangeSuccess', onStateChangeSuccess);
				}

				function onStateChangeSuccess() {
					if (mainDataService) {
						var mainSelected = mainDataService.getSelected();
						if (mainSelected && mainSelected.Id) {
							shouldUpdate = true;
							onCurrentConfigChanged(null, mainSelected);
						}
					}
					if (onStateChangeWatch) {
						onStateChangeWatch();
						onStateChangeWatch = null;
					}
				}

				return service;

			}]);
})(angular);