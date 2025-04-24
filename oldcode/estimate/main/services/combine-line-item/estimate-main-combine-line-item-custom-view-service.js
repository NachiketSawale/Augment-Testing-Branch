/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';
	angular.module(moduleName).factory('estimateMainCombineLineItemCustomViewService', [
		'_',
		'$q',
		'$http',
		'$injector',
		'PlatformMessenger',
		'platformContextService',
		'platformGridAPI',
		'estimateMainCombineLineItemCustomViewConstants',
		function (_, $q, $http, $injector, PlatformMessenger, platformContextService, platformGridAPI, constants) {

			let customViewsCache = {
					items: null
				}, customViewCache = {
					user: null,
					current: null
				};

			let onCurrentCustomViewChanged = new PlatformMessenger();
			let onBaseCombinedViewChanged = new PlatformMessenger();
			let onGetCustomView = new PlatformMessenger();

			function getCustomViews(reload) {
				if (reload || !customViewsCache.items) {
					return $http.get(globals.webApiBaseUrl + 'estimate/main/lineitem/customview/getcustomviews').then(function (response) {
						customViewsCache.items = response.data;
						return customViewsCache.items;
					});
				}
				return $q.when(customViewsCache.items);
			}

			function getInitialCustomView() {
				getCustomViews().then(function (items) {
					customViewCache.user = getDefaultCustomView(items);
					customViewCache.current = angular.copy(customViewCache.user);
				});
			}

			function getDefaultCustomView(items) {
				let customView = _.find(items, {Description: null}), item = null;
				if (!customView) {
					item = _.find(items, {
						IsDefault: true,
						FrmAccessRoleFk: platformContextService.permissionRoleId
					});
					if (item) {
						customView = angular.extend(angular.copy(item), {Version: 0, Id: 0, Description: null});
					}
				}
				if (!customView) {
					item = _.find(items, {IsDefault: true, IsSystem: true});
					if (item) {
						customView = angular.extend(angular.copy(item), {Version: 0, Id: 0, Description: null});
					}
				}
				if (!customView) {
					customView = {
						Description: null
					};
				}
				if (angular.isString(customView.ViewConfig)) {
					customView.ViewConfig = JSON.parse(customView.ViewConfig);
				}
				return customView;
			}

			function getCurrentCustomView() {
				if (!customViewCache.current) {
					let defer = $q.defer();
					getCustomViews().then(function (items) {
						customViewCache.user = getDefaultCustomView(items);
						customViewCache.current = angular.copy(customViewCache.user);
						defer.resolve(customViewCache.current);
					});
					return defer.promise;
				}

				return $q.when(customViewCache.current);
			}

			function setCurrentCustomView(selectedView) {
				if (customViewCache.current) {
					selectedView.ViewConfig = JSON.parse(selectedView.ViewConfig);
					customViewCache.current = selectedView;
					onCurrentCustomViewChanged.fire({
						eventName: constants.eventNames.applyNewCustomView
					});
				}
			}

			function setBaseCombinedView() {
				onBaseCombinedViewChanged.fire({
					eventName: constants.eventNames.changeBaseCombinedView
				});
			}

			function saveCustomView(saveType, customView) {
				return $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/customview/savecustomview?saveType=' + saveType, customView);
			}

			function deleteCustomView(id) {
				return $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/customview/deletecustomview?id=' + id);
			}

			function setDefault(id) {
				return $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/customview/setdefault?id=' + id);
			}

			return {
				getInitialCustomView: getInitialCustomView,
				getCurrentCustomView: getCurrentCustomView,
				setCurrentCustomView: setCurrentCustomView,
				getCustomViews: getCustomViews,
				saveCustomView: saveCustomView,
				deleteCustomView: deleteCustomView,
				setDefault: setDefault,
				setBaseCombinedView: setBaseCombinedView,
				onGetCustomView: onGetCustomView,
				onBaseCombinedViewChanged: onBaseCombinedViewChanged,
				onCurrentCustomViewChanged: onCurrentCustomViewChanged
			};
		}]);
})(angular);
