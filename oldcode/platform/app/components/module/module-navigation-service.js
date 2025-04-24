/**
 * Created by balkanci on 31.03.2015.
 * @name platform.platformModuleNavigationService
 * @function
 * @description Service for navigation
 */
angular.module('platform').service('platformModuleNavigationService', ['$state', 'BasicsLookupdataLookupDictionary', '_', '$http', '$rootScope', 'cloudDesktopKeyService', '$window', 'cloudDesktopNavigationPermissionService',
	function ($state, Dictionary, _, $http, $rootScope, keyService, $window, cloudDesktopNavigationPermissionService) {

		'use strict';

		var naviKey = 'naviParamObj';

		var navigatorFunctionCache = new Dictionary(true);

		var stateBefore = null;

		function registerNavigationEndpoint(navigationEndpoint) {
			navigatorFunctionCache.update(navigationEndpoint.moduleName, navigationEndpoint);
		}

		function navigate(navigatorConfig, entity, triggerField) {

			stateBefore = $state.current.name;
			var moduleName = navigatorConfig.moduleName;
			var naviConfig = angular.extend(_.cloneDeep(navigatorConfig), getNavigator(moduleName));
			var navFunction = getNavFunctionByModule(moduleName);
			var moduleNameCleared = moduleName.split('-')[0].replace('.', '');
			var mainUrl = '#/app/main/';
			if (navFunction || naviConfig.externalEntityParam) {
				var defaultState = globals.defaultState;
				var url = defaultState + '.' + moduleNameCleared;
				try {
					if (!naviConfig.externalEntityParam) {
						$rootScope.$emit('navigateTo', navigatorConfig.moduleName);
						var paramObj;
						var objAsString;
						if (keyService.isCtrlDown() || navigatorConfig.forceNewTab) {
							paramObj = buildParamObjectForNavigation(moduleName, navigatorConfig, entity, triggerField);
							paramObj.timeStamp = Date.now();
							objAsString = JSON.stringify(paramObj);
							localStorage.setItem(naviKey, objAsString);
							keyService.clearKeyListeners();
							$window.open(mainUrl, '_blank');
						} else if (keyService.isShiftDown()) {
							paramObj = buildParamObjectForNavigation(moduleName, navigatorConfig, entity, triggerField);
							paramObj.timeStamp = Date.now();
							objAsString = JSON.stringify(paramObj);
							localStorage.setItem(naviKey, objAsString);
							keyService.clearKeyListeners();
							$window.open(mainUrl, $window.name, 'width=' + window.outerWidth + ',' + ' height=' + window.outerHeight);
						} else {
							$state.go(url).then(function () {
								if (_.isFunction(navFunction)) {
									navFunction(entity, naviConfig.targetIdProperty ? naviConfig.targetIdProperty : triggerField);
								}
							});
						}
					} else {
						// external calls dont change the state, they leave the browser application and open another app like iTWO2016
						if (_.isFunction(navFunction) && !naviConfig.interfaceId) {
							navFunction(entity, naviConfig.targetIdProperty ? naviConfig.targetIdProperty : triggerField);
						} else {
							// call central navigation
							var route = globals.webApiBaseUrl + 'basics/common/externalservice/execute/';
							$http.post(route, {
								NavigationTarget: naviConfig.moduleName,
								EntityTypeQualifier: naviConfig.interfaceId,
								EntityId: entity.Id
							});
						}
					}
				} catch (ex) {
					console.error(ex);
				}
			} else {
				throw 'no Endpoint found for: ' + moduleName;
			}
		}

		function isCurrentState(state) {
			var defaultState = globals.defaultState;
			return $state.current.name === defaultState + '.' + state.replace('.', '');
		}

		function hasPermissionForModule(moduleName) {
			return cloudDesktopNavigationPermissionService.hasPermissionForModule(moduleName);
		}

		function getNavFunctionByModule(moduleName) {
			var navigator = getNavigator(moduleName);
			return navigator && navigator.navFunc ? navigator.navFunc : _.noop;
		}

		function getNavigator(moduleName) {
			return navigatorFunctionCache.get(moduleName);
		}

		function buildParamObjectForNavigation(moduleName, navigatorConfig, entity, field) {
			var paramObj = {};
			var naviConfig = angular.extend(_.cloneDeep(navigatorConfig), getNavigator(moduleName));
			paramObj.moduleName = moduleName;
			paramObj.navigatorConfig = navigatorConfig;
			paramObj.entity = entity;
			paramObj.field = field;
			paramObj.idProperty = naviConfig.targetIdProperty ? naviConfig.targetIdProperty : null;
			delete paramObj.navigatorConfig.forceNewTab;
			if (naviConfig.targetIdProperty) {
				paramObj[naviConfig.targetIdProperty] = entity.Id ? entity.Id : null;
			}

			return paramObj;
		}

		function getParamObject() {
			var paramObj = localStorage.getItem(naviKey);
			var elapsedSeconds;
			var parsedObj;
			if (paramObj !== null && paramObj !== undefined && paramObj !== '') {
				parsedObj = JSON.parse(paramObj);
				elapsedSeconds = (Date.now() - parsedObj.timeStamp) / 1000;
			}

			if (elapsedSeconds > 20) {
				localStorage.removeItem(naviKey);
				return null;
			}

			if (parsedObj !== undefined && parsedObj !== null) {
				return parsedObj;
			} else {
				return null;
			}
		}

		function removeParamObject() {
			localStorage.removeItem(naviKey);
		}

		return {
			registerNavigationEndpoint: registerNavigationEndpoint,
			navigate: navigate,
			isCurrentState: isCurrentState,
			getNavFunctionByModule: getNavFunctionByModule,
			getNavigator: getNavigator,
			getParamObject: getParamObject,
			removeParamObject: removeParamObject,
			hasPermissionForModule: hasPermissionForModule
		};
	}]);