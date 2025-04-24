/**
 * Created by chi on 1/7/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'project.main';
	angular.module(moduleName).controller('projectMainUpdatePriceFromCatalogMatPriceListGridController', projectMainUpdatePriceFromCatalogMatPriceListGridController);

	projectMainUpdatePriceFromCatalogMatPriceListGridController.$inject = [
		'$scope',
		'basicsCommonDialogGridControllerService',
		'projectMainUpdatePriceFromCatalogPriceListUIService',
		'projectMainUpdatePriceFromCatalogPriceListService',
		'projectMainUpdatePriceFromCatalogPriceListValidationService',
		'basicsCommonHeaderColumnCheckboxControllerService',
		'projectMainUpdatePriceFromCatalogMainService',
		'$injector'
	];

	function projectMainUpdatePriceFromCatalogMatPriceListGridController(
		$scope,
		basicsCommonDialogGridControllerService,
		projectMainUpdatePriceFromCatalogPriceListUIService,
		projectMainUpdatePriceFromCatalogPriceListService,
		projectMainUpdatePriceFromCatalogPriceListValidationService,
		basicsCommonHeaderColumnCheckboxControllerService,
		projectMainUpdatePriceFromCatalogMainService,
		$injector
	) {
		var gridConfig = {
			initCalled: false,
			columns: [],
			uuid: 'e7ce20703b104c4c90de96144a910ad2',
			collapsed: true
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
			projectMainUpdatePriceFromCatalogPriceListUIService,
			projectMainUpdatePriceFromCatalogPriceListService,
			projectMainUpdatePriceFromCatalogPriceListValidationService,
			gridConfig
		);

		basicsCommonHeaderColumnCheckboxControllerService.init($scope, null, headerCheckBoxFields, headerCheckBoxEvents);

		////////////////
		function checkAll(e) {
			var isSelected = (e.target.checked);
			projectMainUpdatePriceFromCatalogPriceListService.changeAllToSelected(isSelected);
			projectMainUpdatePriceFromCatalogPriceListService.changeSourceOption();
			var selectedInfo = projectMainUpdatePriceFromCatalogPriceListService.collectSourceInfo();
			projectMainUpdatePriceFromCatalogMainService.priceListSelectionChanged.fire(null, selectedInfo);
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
	}
})(angular);
