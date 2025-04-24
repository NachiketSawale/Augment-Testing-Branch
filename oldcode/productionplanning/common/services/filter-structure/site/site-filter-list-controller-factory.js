(function (angular) {

	'use strict';
	/* global _ */
	const moduleName = 'productionplanning.common';
	angular.module(moduleName).factory('ppsCommonSiteListControllerFactory', SiteListControllerFactory);

	SiteListControllerFactory.$inject = ['productionplanningCommonStructureFilterService',
		'platformGridControllerService',
		'basicsSiteUIStandardService',
		'estimateCommonControllerFeaturesServiceProvider'];

	function SiteListControllerFactory(commonStructureFilterService,
		platformGridControllerService,
		uiStandardService,
		estimateCommonControllerFeaturesServiceProvider) {
		var service = {};

		service.initSiteFilter = function ($scope, config, enableGridCfgIfPinProject = true) {
			var filterId = config.filterId;
			var siteFilterDataService = config.siteFilterDataService;
			var mainService = config.mainService;
			var dragDropService = config.dragDropService;

			var needRemark = false;

			var gridConfig = {
				initCalled: false,
				columns: [],
				parentProp: 'SiteFk',
				childProp: 'ChildItems',
				type: 'site-leadingStructure',
				dragDropService: dragDropService,
				marker: {
					filterService: commonStructureFilterService,
					filterId: filterId,
					dataService: siteFilterDataService,
					serviceName: siteFilterDataService.getServiceName(),
					serviceMethod: 'getList',
					multiSelect: false
				}
			};

			var columns = angular.copy(uiStandardService.getStandardConfigForListView().columns);
			_.forEach(columns, function (column) {
				column.editor = null;
			});

			var uiService = {
				getStandardConfigForListView: () => {
					return {
						columns: columns,
						addValidationAutomatically: true
					};
				}
			};

			siteFilterDataService.extendByFilter(mainService.getServiceName(), filterId, commonStructureFilterService);
			platformGridControllerService.initListController($scope, uiService, siteFilterDataService, null, gridConfig);
			if (enableGridCfgIfPinProject) {
				estimateCommonControllerFeaturesServiceProvider.extendControllerByIsProjectContextService($scope);
			}

			var toolItem = _.find($scope.tools.items, {id: 't13'});  // item filter button
			if (toolItem) {
				toolItem.caption = 'productionplanning.common.toolbarMainEntityFilter';
			}
			toolItem = _.find($scope.tools.items, {id: 't11'});
			if (toolItem) {
				var filterFn = toolItem.fn;
				toolItem.fn = function () {
					filterFn();
					siteFilterDataService.clearMarkers();
				};
			}

			function markDefaultSite() {
				var markedItems = siteFilterDataService.markedItems;
				if (markedItems && _.isArray(markedItems) && markedItems.length > 0) {
					return;
				}

				var root = siteFilterDataService.getTree();
				if (root && _.isArray(root) && root.length > 0) {
					var markedSites = [];
					siteFilterDataService.getDefaultSiteId().then(function (siteFk) {
						if (siteFk && siteFk.data) {
							siteFilterDataService.setItemMarkers(root, [siteFk.data], markedSites);
							if (markedSites && _.isArray(markedSites) && markedSites.length > 0) {
								siteFilterDataService.markersChanged(markedSites, true);
								siteFilterDataService.setSelected(markedSites[0]);
								siteFilterDataService.gridRefresh();
								$scope.tools.update();
							}
						}
					});
				}
			}

			function handleRefreshRequested() {
				needRemark = true;
			}

			function handleListLoaded() {
				if (needRemark) {
					var root = siteFilterDataService.getTree();
					if (root && _.isArray(root) && root.length > 0) {
						needRemark = false;
						var markedItems = siteFilterDataService.markedItems;
						if (markedItems && _.isArray(markedItems) && markedItems.length > 0) {
							var markedItemIds = _.map(markedItems, 'Id');
							siteFilterDataService.setSelected(markedItems[0]);
							siteFilterDataService.setItemMarkers(root, markedItemIds);
							siteFilterDataService.gridRefresh();
							$scope.tools.update();
						}
					}
				}
			}

			commonStructureFilterService.onFilterButtonRemoved.register($scope.updateTools);
			mainService.registerRefreshRequested(siteFilterDataService.refresh);
			siteFilterDataService.registerSelectionChanged(siteFilterDataService.selectionChanged);
			mainService.registerRefreshRequested(handleRefreshRequested);
			mainService.registerListLoaded(handleListLoaded);
			siteFilterDataService.registerListLoaded(markDefaultSite);
			siteFilterDataService.load();

			$scope.$on('$destroy', function () {
				commonStructureFilterService.onFilterButtonRemoved.unregister($scope.updateTools);
				mainService.unregisterRefreshRequested(siteFilterDataService.refresh);
				siteFilterDataService.unregisterRefreshRequested(siteFilterDataService.selectionChanged);
				mainService.unregisterRefreshRequested(handleRefreshRequested);
				mainService.unregisterListLoaded(handleListLoaded);
				siteFilterDataService.unregisterListLoaded(markDefaultSite);
			});
		};

		return service;
	}
})(angular);
