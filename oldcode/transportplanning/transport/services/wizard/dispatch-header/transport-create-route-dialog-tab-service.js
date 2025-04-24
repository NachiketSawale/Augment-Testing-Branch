/**
 * Created by anl on 8/11/2021.
 */
(function (angular) {
	'use strict';
	/* global angular, _*/
	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).factory('transportplanningTransportCreateRouteTabService', TabService);

	TabService.$inject = [
		'$injector',
		'platformGridAPI',
		'$translate',
		'$interval',
		'basicsCommonToolbarExtensionService'];

	function TabService(
		$injector,
		platformGridAPI,
		$translate,
		$interval,
		basicsCommonToolbarExtensionService) {

		var service = {};
		service.getModule = function () {
			return 'transportplanningTransportCreateRouteTabService';
		};

		service.initialize = function (scope) {
			var preTab;
			scope.onTabSelect = function (tab) {
				if (preTab) {
					if (!service.endEdit(preTab)) {
						preTab.active = true;
						return;
					}
				}
				tab.initialized = true;
				var dataService = getService(tab.service);
				switch (tab.gridId) {
					case 'a6c5fff882aa4ac59cc954cca95334a7':
						dataService.updateList(scope.context.Waypoints);
						break;
					case '86c10b09d5e64b03988fe458d3f89c46':
						dataService.updateList(scope.context.Packages);
						break;
				}
				preTab = tab;
			};

			scope.tabs = [
				{
					title: '*Waypoints',
					titleStr: 'transportplanning.transport.waypointListTitle',
					service: 'transportplanningTransportCreateRouteWaypointService',
					uiService: 'transportplanningTransportWaypointUIStandardService',
					grid: {state: 'a6c5fff882aa4ac59cc954cca95334a7'},
					active: true,
					initialized: true,
					editColumns: ['PlannedTime']
				}, {
					title: '*Packages',
					titleStr: 'transportplanning.transport.packageListTitle',
					service: 'transportplanningTransportCreateRoutePackageService',
					uiService: 'transportplanningPackageUIStandardService',
					grid: {state: '86c10b09d5e64b03988fe458d3f89c46'}
				}
			];

			_.forEach(scope.tabs, function (tab) {
				var gridId = tab.grid.state;
				var dataService = getService(tab.service);
				dataService.initialize();
				tab.gridId = gridId;
				tab.title = $translate.instant(tab.titleStr) ? $translate.instant(tab.titleStr) : tab.title;

				tab.tools = {
					showImages: false,
					showTitles: true,
					cssClass: 'tools',
					items: [
						{
							id: 'd0',
							type: 'divider'
						}
					]
				};
				basicsCommonToolbarExtensionService.addBtn(tab, null, null, 'G');

				function updateItemList(e, arg) {
					$interval(function () {
						var grid = platformGridAPI.grids.element('id', gridId);
						if (grid && grid.dataView) {
							grid.dataView.setItems(arg);
							platformGridAPI.grids.refresh(gridId, true);
						}
					}, 300, 1);
				}

				dataService.registerListLoaded(updateItemList);

				tab.destroy = function () {
					dataService.unregisterListLoaded(updateItemList);
				};
			});

			service.endEdit = function (target) {
				var result = true;
				var currentTab = target ? target : _.find(scope.tabs, function (tab) {
					return tab.active;
				});
				platformGridAPI.grids.commitEdit(currentTab.grid.state);
				if (!service.isTabValid()) {
					result = false;
					currentTab.active = true;
				}
				return result;
			};

			service.getResult = function () {
				var result = {};
				_.forEach(scope.tabs, function (tab) {
					_.extend(result, getService(tab.service).getResult());
				});
				return result;
			};

			service.destroy = function () {
				_.forEach(scope.tabs, function (tab) {
					tab.destroy();
				});
			};

			service.isTabValid = function () {
				return true;
			};

			service.clear = function () {
				_.forEach(scope.tabs, function (tab) {
					getService(tab.service).deleteAll();
				});
			};
		};

		function getService(service) {
			return _.isString(service) ? $injector.get(service) : service;
		}

		return service;
	}
})(angular);