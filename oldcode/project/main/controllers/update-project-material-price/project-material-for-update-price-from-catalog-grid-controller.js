/**
 * Created by chi on 1/7/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'project.main';
	angular.module(moduleName).controller('projectMainUpdatePriceFromCatalogPrjMaterialGridController', projectMainUpdatePriceFromCatalogPrjMaterialGridController);

	projectMainUpdatePriceFromCatalogPrjMaterialGridController.$inject = [
		'$scope',
		'_',
		'basicsCommonDialogGridControllerService',
		'projectMainUpdatePriceFromCatalogMaterialUIService',
		'projectMainUpdatePriceFromCatalogProjectMaterialService',
		'projectMainUpdatePriceFromCatalogProjectMaterialValidationService',
		'basicsCommonHeaderColumnCheckboxControllerService',
		'$injector',
		'$translate',
		'$http',
		'projectMainUpdatePriceFromCatalogMainService',
		'platformTranslateService',
		'platformGridDomainService'
	];

	function projectMainUpdatePriceFromCatalogPrjMaterialGridController(
		$scope,
		_,
		basicsCommonDialogGridControllerService,
		projectMainUpdatePriceFromCatalogMaterialUIService,
		projectMainUpdatePriceFromCatalogProjectMaterialService,
		projectMainUpdatePriceFromCatalogProjectMaterialValidationService,
		basicsCommonHeaderColumnCheckboxControllerService,
		$injector,
		$translate,
		$http,
		projectMainUpdatePriceFromCatalogMainService,
		platformTranslateService,
		platformGridDomainService
	) {
		let pageSize = 100;
		let requestUrl = $scope.options.url || 'project/material/getprojectmaterialsf4updatepricesfromcatalog';
		let pageTotalLength = ($scope.options.page && $scope.options.page.totalLength) || 0;
		let pageCurrentLength = ($scope.options.page && $scope.options.page.currentLength) || 0;
		var page = {
			number: 0,
			size: pageSize,
			totalLength: pageTotalLength,
			currentLength: pageCurrentLength,
			count: Math.ceil(pageTotalLength / pageSize)
		};
		// $scope.gridId = 'ce5ae346f4c74fba98d776f756537eec';
		 var GridColumns = angular.copy(projectMainUpdatePriceFromCatalogMaterialUIService.getStandardConfigForListView().columns);
		var settings = {columns: []};
		_.forEach(GridColumns, function (column) {
			settings.columns.push(column);
		});
		 var extendGridColumns = platformTranslateService.translateGridConfig(extendGrouping(settings.columns));

		var gridConfig = {
			initCalled: false,
			columns: extendGridColumns,
			idProperty: 'Id',
			collapsed: true,
			uuid: 'ce5ae346f4c74fba98d776f756537eec',
			enableDraggableGroupBy: true,
			indicator: true,
			enableModuleConfig: true,
		};

		var headerCheckBoxFields = ['Selected'];
		var headerCheckBoxEvents = [
			{
				source: 'grid',
				name: 'onHeaderCheckboxChanged',
				fn: checkAll
			}
		];

		basicsCommonDialogGridControllerService.initListController(
			$scope,
			projectMainUpdatePriceFromCatalogMaterialUIService,
			projectMainUpdatePriceFromCatalogProjectMaterialService,
			projectMainUpdatePriceFromCatalogProjectMaterialValidationService,
			gridConfig
		);

		basicsCommonHeaderColumnCheckboxControllerService.init($scope, null, headerCheckBoxFields, headerCheckBoxEvents);

		////////////////
		function checkAll(e) {
			var selected = (e.target.checked);
			projectMainUpdatePriceFromCatalogProjectMaterialService.selectAll(selected);
		}

		function getTools(tools) {
			function parsePermission(tool) {
				if (_.isString(tool.permission)) {
					let splits = tool.permission.split('#');
					tool.permission = {};
					tool.permission[splits[0]] = $injector.get('platformPermissionService').permissionsFromString(splits[1]);
				}
			}
			tools.items = _.filter(tools.items, function (item) {
				return !item.iconClass || _.includes([
						'tlb-icons ico-group-columns',
						'tlb-icons ico-tree-collapse',
						'tlb-icons ico-tree-expand',
						'tlb-icons ico-tree-collapse-all',
						'tlb-icons ico-tree-expand-all',
						'tlb-icons ico-search-all',
						'tlb-icons ico-search-column',
						'tlb-icons ico-print-preview',
						'tlb-icons ico-settings'
					],
					item.iconClass || item.icoClass);
			});
			// avoid error in console of explorer.
			tools.update = function () {
				tools.version += 1;
			};
			tools.refresh = function () {
				tools.refreshVersion += 1;
			};

			// It is a bad practice to override 'setTools' and 'getTools' function, for example, here missing some permission data transform lead to 'Grid Layout' config button disappear.
			_.each(tools.items, function (tool) {
				parsePermission(tool);
				if (tool.list && tool.list.items && _.isArray(tool.list.items)) {
					_.each(tool.list.items, function (subTool) {
						parsePermission(subTool);
					});
				}
			});
			return tools;
		}
		$scope.setTools = function (tools) {
			$scope.tools = getTools(tools);
		};

		$scope.getPageText = getPageText;
		$scope.getFirstPage = getFirstPage;
		$scope.getLastPage = getLastPage;
		$scope.getPrevPage = getPrevPage;
		$scope.getNextPage = getNextPage;
		$scope.canFirstPage = $scope.canPrevPage = canFirstOrPrevPage;
		$scope.canLastPage = $scope.canNextPage = canLastOrNextPage;

		$scope.removeToolByClass = function removeToolByClass(cssClassArray) {
			$scope.tools.items = _.filter($scope.tools.items, function (toolItem) {
				let notFound = true;
				_.each(cssClassArray, function (CssClass) {
					if (CssClass === toolItem.iconClass) {
						notFound = false;
					}
				});
				return notFound;
			});
			$scope.tools.update();
		};

		function getPageText() {
			var startIndex = page.number * page.size,
				endIndex = ((page.count - (page.number + 1) > 0 ? startIndex + page.size : page.totalLength));

			if ($scope.isLoading) {
				return $translate.instant('cloud.common.searchRunning');
			}
			if (page.currentLength === 0) {
				return $translate.instant('cloud.common.noSearchResult');
			}
			return (startIndex + 1) + ' - ' + endIndex + ' / ' + page.totalLength;
		}
		getFirstPage();
		function getFirstPage() {
			page.number = 0;
			getListByPage();
		}

		function getLastPage() {
			page.number = page.count - 1;
			getListByPage();
		}

		function getPrevPage() {
			if (page.number <= 0) {
				return;
			}
			page.number--;
			getListByPage();
		}

		function getNextPage() {
			if (page.count <= page.number) {
				return;
			}
			page.number++;
			getListByPage();
		}

		function canFirstOrPrevPage() {
			return page.number > 0;
		}

		function canLastOrNextPage() {
			return page.count > (page.number + 1);
		}

		function getListByPage() {
			$scope.isLoading = true;
			let selectedEstHeaderItem = $injector.get ('estimateMainService').getSelectedEstHeaderItem ();
			$http.get(globals.webApiBaseUrl + requestUrl+'?projectId=' + projectMainUpdatePriceFromCatalogMainService.projectId+'&estHeaderFk='+(selectedEstHeaderItem ? selectedEstHeaderItem.Id : null)+'&pageSize='+pageSize+'&pageIndex='+page.number)
				.then(function (response) {
					if (!response || !response.data) {
						projectMainUpdatePriceFromCatalogProjectMaterialService.setList([]);
						page.currentLength = response.data.RecordsRetrieved;
					}
					else {
						projectMainUpdatePriceFromCatalogProjectMaterialService.setList(response.data.ProjectMaterials);
						page.currentLength = response.data.RecordsRetrieved;
						page.totalLength = response.data.RecordsFound;
						page.count = Math.ceil(page.totalLength / pageSize);
						var prjMaterial2PriceListMap = response.data.PrjMaterial2PriceListMap;
						projectMainUpdatePriceFromCatalogMainService.priceListLoaded.fire(null, prjMaterial2PriceListMap);
						projectMainUpdatePriceFromCatalogMainService.cacheData = prjMaterial2PriceListMap;
					}
				})
				.finally(function () {
					$scope.isLoading = false;
					let tempDatas = projectMainUpdatePriceFromCatalogProjectMaterialService.tempData;
					if(tempDatas !== null &&tempDatas .length>=1) {
						projectMainUpdatePriceFromCatalogProjectMaterialService.MarkSelected(tempDatas);
					}
				});
		}

		function extendGrouping(gridColumns) {
			angular.forEach(gridColumns, function (column) {
				angular.extend(column, {
					grouping: {
						title: column.name$tr$, getter: column.field, aggregators: [], aggregateCollapsed: true
					}, formatter: column.formatter || platformGridDomainService.formatter('description')
				});
			});
			return gridColumns;
		}
	}
})(angular);
