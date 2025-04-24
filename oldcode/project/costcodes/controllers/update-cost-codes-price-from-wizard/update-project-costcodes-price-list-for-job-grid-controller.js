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
	angular.module(moduleName).controller('projectCostcodesPriceListForJobGridController', [
		'$element', '$scope', '$injector', '_', 'basicsCommonDialogGridControllerService', 'projectCostCodesPriceListJobDynConfigService',
		'projectCostCodesPriceListForJobDataService', 'basicsCommonHeaderColumnCheckboxControllerService',
		'projectCostCodesPriceListForJobMessengerService', 'projectCostCodesPriceListForJobValidationService','platformGridAPI',
		function ($element, $scope, $injector, _, dialogGridControllerService, uiStandardService, dataService,
			basicsCommonHeaderColumnCheckboxControllerService, messengerService, validationService,platformGridAPI) {
			let gridConfig = {
				uuid: '3b971ff120df463da2d461da57a33511',
				initCalled: false,
				columns: [],
				idProperty: 'VirtualId',
				parentProp: 'VirtualParentId',
				childProp: 'ProjectCostCodes',
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
			dialogGridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);
			$injector.get('platformContainerUiAddOnService').addManagerAccessor($scope, $element, angular.noop);
			let checkboxFields = ['IsChecked'];
			let headerCheckBoxEvents = [
				{
					source: 'grid',
					name: 'onHeaderCheckboxChanged',
					fn: function (e) {
						dataService.setSeletedToAll(e.target.checked);
					}
				}
			];
			basicsCommonHeaderColumnCheckboxControllerService.init($scope, null, checkboxFields, headerCheckBoxEvents);

			// load data and check all
			dataService.load().then(function () {
				dataService.setSeletedToAll(true);
				dataService.calcAllRealFactors();
				dataService.gridRefresh();
				dataService.setAllBaseSelected();
			});

			function changeCostCodePriceVersionByJob(e,args){
				if(args && args.job){
					dataService.changeCostCodePriceVersionByJob(args.job, args.priceVersionFk);
				}
			}

			function changeCostCodePriceVersion(e,args){
				if(args && args.prjCostCodes){
					dataService.changeCostCodePriceVersion(args.prjCostCodes, args.priceVersionFk, args.needCompute);
				}
			}

			function computePrjCostCodes(e,args){
				if(args && args.prjCostCodes){
					dataService.computePrjCostCodes(args.prjCostCodes);
				}
			}

			// Dynamic Columns
			function setDynamicColumnsLayoutToGrid(){
				uiStandardService.applyToScope($scope);
			}
			uiStandardService.registerSetConfigLayout(setDynamicColumnsLayoutToGrid);
			let projectJobDynamicColumnService = $injector.get('projectCostCodesPriceListJobDynColumnService');
			projectJobDynamicColumnService.loadDynamicColumns();

			messengerService.JobPriceVersionSelectedChanged.register(changeCostCodePriceVersionByJob);
			messengerService.PrjCostCodesPriceVersionSelectedChanged.register(changeCostCodePriceVersion);
			messengerService.PriceListRecordSelectedChanged.register(computePrjCostCodes);
			messengerService.PriceListRecordWeightingChanged.register(computePrjCostCodes);

			function onInitialized() {
				projectJobDynamicColumnService.loadDynamicColumns();
			}

			platformGridAPI.events.register($scope.gridId, 'onInitialized', onInitialized);

			$scope.$on('$destroy', function () {
				messengerService.JobPriceVersionSelectedChanged.unregister(changeCostCodePriceVersionByJob);
				messengerService.PrjCostCodesPriceVersionSelectedChanged.unregister(changeCostCodePriceVersion);
				messengerService.PriceListRecordSelectedChanged.unregister(computePrjCostCodes);
				messengerService.PriceListRecordWeightingChanged.unregister(computePrjCostCodes);
				dataService.clearFiltersAndData();
			});
		}
	]);
})(angular);