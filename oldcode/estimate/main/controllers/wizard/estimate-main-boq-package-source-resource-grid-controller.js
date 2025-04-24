(function () {
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).controller('estimateMainBoqPackageSourceResourceGridController', estimateMainBoqPackageSourceResourceGridController);

	estimateMainBoqPackageSourceResourceGridController.$inject = ['$scope', '$injector', 'platformGridAPI', 'platformTranslateService', 'estimateMainTriStateCheckboxService', 'basicsLookupdataLookupControllerFactory',
		'estimateMainResourceConfigurationService', '_', '$translate', 'estimateMainCreateBoQPackageWizardService'];

	function estimateMainBoqPackageSourceResourceGridController($scope, $injector, platformGridAPI, platformTranslateService, estimateMainTriStateCheckboxService, basicsLookupdataLookupControllerFactory,
		estimateMainResourceConfigurationService, _, $translate, wizardService) {

		let gridId = 'CE7E1D028B124C178A27AD57D143B070';
		$scope.gridData = {
			state: gridId
		};
		$scope.gridId = gridId;
		$scope.options = $scope.modalOptions;
		$scope.entity.modeFlg = 1;

		let selectTriStateCheckBox = estimateMainTriStateCheckboxService($scope, 'ResourceChildren', 'EstResourceFk', 'IsSelected', 'IsSelected', gridId);
		let resourceColumns = angular.copy(estimateMainResourceConfigurationService.getStandardConfigForListView().columns);
		let shownFields = ['EstResourceTypeShortKey', 'EstResourceTypeFkExtend', 'Code', 'DescriptionInfo', 'Quantity', 'BasUomFk',
			'Budget', 'CostTotal'];
		let pageTotalLength = 0;
		let pageCurrentLength = 0;
		let pageSize = 100;
		let page = {
			number: 0,
			size: pageSize,
			totalLength: pageTotalLength,
			currentLength: pageCurrentLength,
			count: Math.ceil(pageTotalLength / pageSize)
		};
		resourceColumns = _.filter(resourceColumns, function (col) {
			if (_.includes(shownFields, col.field)) {
				col.editor = null;
				return true;
			}
			return false;
		});
		let columns = [
			selectTriStateCheckBox.getFieldConfiguration(),
			{
				id: 'lineItemCode',
				field: 'LineItemCode',
				name: 'LI Code',
				toolTip$tr$: 'estimate.main.createBoqPackageWizard.resourceSelectionPage.lineItemCode',
				formatter: 'code',
				name$tr$: 'estimate.main.createBoqPackageWizard.resourceSelectionPage.lineItemCode',
				width: 142
			},
			{
				id: 'lineItemDesc',
				field: 'LineItemDescription',
				name: 'Line Item Description',
				toolTip$tr$: 'estimate.main.createBoqPackageWizard.resourceSelectionPage.lineItemDesc',
				formatter: 'description',
				name$tr$: 'estimate.main.createBoqPackageWizard.resourceSelectionPage.lineItemDesc',
				width: 200
			}
		];

		columns = _.concat(columns, resourceColumns);

		let gridConfig = {
			columns: columns,
			data: [],
			id: gridId,
			gridId: gridId,
			idProperty: 'Id',
			lazyInit: false,
			options: {
				tree: true,
				parentProp: 'EstResourceFk',
				collapsed: false,
				expanded: true,
				showHeaderRow: false,
				showFilterRow: false,
				childProp: 'ResourceChildren'
			},
			treeOptions: {
				tree: true,
				idProperty: 'Id',
				parentProp: 'EstResourceFk',
				childProp: 'ResourceChildren',
				collapsed: false,
				expanded: true,
				showFilterRow: false,
				showHeaderRow: false
			},
			gridOptions: {
				showFilterRow: false
			}
		};

		$scope.isLoading = true;
		$scope.formOptions = {};

		function loading() {
			$scope.isLoading = false;
		}

		$scope.setTools = function (tools) {
			tools.update = function () {
				tools.version += 1;
			};
		};
		$scope.tools = null;
		basicsLookupdataLookupControllerFactory.create({grid: true, dialog: true, search: false}, $scope, gridConfig);

		let toolItems = [];
		toolItems.push(
			{
				id: 't7',
				sort: 60,
				caption: 'cloud.common.toolbarCollapse',
				type: 'item',
				iconClass: 'tlb-icons ico-tree-collapse',
				fn: function collapseSelected() {
					platformGridAPI.rows.collapseNode($scope.gridId);
				}
			},
			{
				id: 't8',
				sort: 70,
				caption: 'cloud.common.toolbarExpand',
				type: 'item',
				iconClass: 'tlb-icons ico-tree-expand',
				fn: function expandSelected() {
					platformGridAPI.rows.expandNode($scope.gridId);
				}
			},
			{
				id: 't9',
				sort: 80,
				caption: 'cloud.common.toolbarCollapseAll',
				type: 'item',
				iconClass: 'tlb-icons ico-tree-collapse-all',
				fn: function collapseAll() {
					platformGridAPI.rows.collapseAllSubNodes($scope.gridId);
				}
			},
			{
				id: 't10',
				sort: 90,
				caption: 'cloud.common.toolbarExpandAll',
				type: 'item',
				iconClass: 'tlb-icons ico-tree-expand-all',
				fn: function expandAll() {
					platformGridAPI.rows.expandAllSubNodes($scope.gridId);
				}
			});

		platformTranslateService.translateGridConfig(gridConfig);

		$scope.tools.items = toolItems.concat($scope.tools.items);
		$scope.tools.items = _.filter($scope.tools.items, function (d) {
			return d.id !== 't12';
		});

		$scope.getPageText = getPageText;
		$scope.getFirstPage = getFirstPage;
		$scope.getLastPage = getLastPage;
		$scope.getPrevPage = getPrevPage;
		$scope.getNextPage = getNextPage;
		$scope.canFirstPage = $scope.canPrevPage = canFirstOrPrevPage;
		$scope.canLastPage = $scope.canNextPage = canLastOrNextPage;

		wizardService.closeIsLoading.register(loading);
		wizardService.resourceResultPageInfoChanged.register(resetPageInfo);

		$scope.$on('$destroy', function () {
			if (platformGridAPI.grids.exist(gridId)) {
				platformGridAPI.grids.unregister(gridId);
				wizardService.closeIsLoading.unregister(loading);
				wizardService.resourceResultPageInfoChanged.unregister(resetPageInfo);
				if ($scope.$close) {
					$scope.$close();
				}
			}
		});

		function resetPageInfo(pageInfo) {
			if (!pageInfo) {
				return;
			}
			page.number = pageInfo.pageIndex;
			page.totalLength = pageInfo.totalCount;
			page.currentLength = pageInfo.dataCount;
			page.count = Math.ceil(page.totalLength / page.size);
		}

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
			return page.number > 0 && angular.isFunction(wizardService.getResourceListByPage);
		}

		function canLastOrNextPage() {
			return page.count > (page.number + 1) && angular.isFunction(wizardService.getResourceListByPage);
		}

		function getListByPage() {
			if (wizardService.getResourceListByPage) {
				wizardService.getResourceListByPage(page.number, true);
			}
		}
	}
})();
