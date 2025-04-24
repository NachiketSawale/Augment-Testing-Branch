/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'project.costcodes';
	/**
	 * @ngdoc controller
	 * @name procurementPriceComparisonBoqColumnDialogController
	 * @requires $scope
	 * @description
	 * #
	 * Controller of boq column dialog.
	 */
	/* jshint -W072 */
	angular.module(moduleName).controller('projectCostcodesPriceListRecordGridController', [
		'_', '$element', '$scope', '$injector', 'basicsCommonDialogGridControllerService', 'projectCostCodesPriceListRecordDynConfigService',
		'projectCostCodesPriceListRecordDataService', 'basicsCommonHeaderColumnCheckboxControllerService',
		'projectCostCodesPriceListForJobDataService', 'projectCostCodesPriceListForJobMessengerService',
		'projectCostCodesPriceListRecordValidationService','platformGridAPI',
		function (_, $element, $scope, $injector, dialogGridControllerService, uiService,
			dataService, basicsCommonHeaderColumnCheckboxControllerService,
			parentService, messengerService, validationService, platformGridAPI) {
			let gridConfig = {
				uuid: '80c94a0fb2dc4048b54ca845febf2411',
				initCalled: false,
				columns: [],
				grouping: false
			};

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
						'tlb-icons ico-print-preview',
						'tlb-icons ico-search-all',
						'tlb-icons ico-search-column',
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

			dialogGridControllerService.initListController($scope, uiService, dataService, validationService, gridConfig);
			$injector.get('platformContainerUiAddOnService').addManagerAccessor($scope, $element, angular.noop);
			let checkboxFields = ['Selected'];
			let headerCheckBoxEvents = [
				{
					source: 'grid',
					name: 'onHeaderCheckboxChanged',
					fn: function (e) {
						dataService.setSeletedToAll(e.target.checked);
						let parentService = $injector.get('projectCostCodesPriceListForJobDataService');
						messengerService.PriceListRecordSelectedChanged.fire(null, {prjCostCodes: parentService.getSelected()});
					}
				}
			];
			basicsCommonHeaderColumnCheckboxControllerService.init($scope, null, checkboxFields, headerCheckBoxEvents);

			// Dynamic Columns
			function setDynamicColumnsLayoutToGrid(){
				uiService.applyToScope($scope);
			}
			uiService.registerSetConfigLayout(setDynamicColumnsLayoutToGrid);
			let priceListRecordDynamicColumnService = $injector.get('projectCostCodesPriceListRecordDynColumnService');
			priceListRecordDynamicColumnService.loadDynamicColumns();
			let priceListRecordBasCostCodesColumnService = $injector.get('projectCostCodesPriceListRecordBasCostCodesColumnService');
			priceListRecordBasCostCodesColumnService.loadDynamicColumns();

			function onInitialized() {
				priceListRecordDynamicColumnService.loadDynamicColumns();
				priceListRecordBasCostCodesColumnService.loadDynamicColumns();
			}

			platformGridAPI.events.register($scope.gridId, 'onInitialized', onInitialized);
			function load(){
				dataService.load();
			}
			parentService.registerSelectionChanged(load);
			$scope.$on('$destroy', function () {
				parentService.unregisterSelectionChanged(load);
			});
		}
	]);
})(angular);