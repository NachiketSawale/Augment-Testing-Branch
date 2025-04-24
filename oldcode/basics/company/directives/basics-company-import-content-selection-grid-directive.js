(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'basics.company';

	angular.module(moduleName).directive('basicsCompanyImportContentSelectionGridDirective', [
		'$translate', 'platformGridAPI', 'platformObjectHelper', 'basicsCommonDialogGridControllerService',
		function ($translate, platformGridAPI, platformObjectHelper, dialogGridControllerService) {

			return {
				restrict: 'A',
				scope: {},
				replace: false,
				templateUrl: globals.appBaseUrl + 'basics.company/partials/import-content-selection-grid.html',
				controller: ['$scope', '_', 'basicsCompanyImportContentOperationtypeService',
					'basicsCompanyImportContentSelectionGridDataService',
					'basicsCompanyImportContentSelectionGridValidationService',
					'basicsCompanyImportContentSelectionGridUIService',
					'basicsCommonHeaderColumnCheckboxControllerService',
					controller]
			};

			function controller($scope, _, basicsCompanyImportContentOperationtypeService, dataService,
				validateService, uiService, basicsCommonHeaderColumnCheckboxControllerService) {

				$scope.gridUUID = '0b284e4e20c04e83a73df2e109e5af95';
				var gridConfig = {
					uuid: $scope.gridUUID,
					initCalled: false,
					columns: [],
					grouping: false,
					idProperty: 'idString',
					parentProp: 'pid', childProp: 'children',
					enableConfigSave: false,
					cellChangeCallBack: onCellChangeCallBack
				};

				function onCellChangeCallBack(e) {
					if (e.cell === 2) {
						var item = e.item;
						if (item.children) {
							for (var i = 0; i < item.children.length; i++) {
								item.children[i].selection = item.selection;
							}
						}

						if (item.pid !== null) {
							var contentArray = dataService.getList();
							var rootNode = _.find(contentArray, {id: item.pid});
							if (rootNode !== null && rootNode !== undefined) {
								var unselected = _.find(rootNode.children, {selection: false});
								var selected = _.find(rootNode.children, {selection: true});
								if (unselected && selected) {
									rootNode.selection = false;
								} else if (selected && angular.isUndefined(unselected)) {
									rootNode.selection = true;
								} else if (angular.isUndefined(selected) && unselected) {
									rootNode.selection = false;
								}
							}
						}

						syncSelectionWicToWicAssemblyAssignment(item);

						dataService.gridRefresh();
					}
				}

				function syncSelectionWicToWicAssemblyAssignment(item){
					if(item.runtimeCode !== 'boq.wic') {
						return;
					}

					var contentArray = dataService.getList();
					var wicAssemblyAssignmentRoot = _.find(contentArray, {runtimeCode: 'boq.wic.assembly', level: 0});
					if(wicAssemblyAssignmentRoot === null || wicAssemblyAssignmentRoot === undefined) {
						return;
					}

					var targetItem = null;
					if(item.level === 0){
						targetItem = wicAssemblyAssignmentRoot;
					}
					else if(item.level === 1){
						targetItem = _.find(wicAssemblyAssignmentRoot.children, {code: item.code});
					}

					if(targetItem){
						targetItem.selection = item.selection;
						if (targetItem.children) {
							for (var i = 0; i < targetItem.children.length; i++) {
								targetItem.children[i].selection = targetItem.selection;
							}
						}

						if (targetItem.pid !== null) {
							var rootNode = wicAssemblyAssignmentRoot;
							if (rootNode !== null && rootNode !== undefined) {
								var unselected = _.find(rootNode.children, {selection: false});
								var selected = _.find(rootNode.children, {selection: true});
								if (unselected && selected) {
									rootNode.selection = false;
								} else if (selected && angular.isUndefined(unselected)) {
									rootNode.selection = true;
								} else if (angular.isUndefined(selected) && unselected) {
									rootNode.selection = false;
								}
							}
						}
					}
				}

				dialogGridControllerService.initListController($scope, uiService, dataService, validateService, gridConfig);

				var checkboxFields = ['selection'];
				var headerCheckBoxEvents = [
					{
						source: 'grid',
						name: 'onHeaderCheckboxChanged',
						fn: function (e) {
							var isSelected = (e.target.checked);
							var items = dataService.getList();
							angular.forEach(items,function (item) {
								if(item.children && item.children.length>0){
									angular.forEach(item.children,function (child) {
										child.selection = isSelected;
									});
								}
							});
						}
					}
				];
				basicsCommonHeaderColumnCheckboxControllerService.init($scope, null, checkboxFields, headerCheckBoxEvents);
				var setGridReadonly = function setGridReadonly(e, args) {
					return args.item.level === 0 && args.item.runtimeCode === 'basics.unit';// only unit allow new operation
				};

				var setGridReadOnly = function setGridReadOnly(gridId) {
					unSetGridReadOnly(gridId);
					platformGridAPI.events.register(gridId, 'onBeforeEditCell', setGridReadonly);
				};

				var unSetGridReadOnly = function unSetGridReadOnly(gridId) { // jshint ignore:line
					platformGridAPI.events.unregister(gridId, 'onBeforeEditCell', setGridReadonly);
				};

				setGridReadOnly($scope.gridUUID);

				function setLoad() {
					dataService.load();
				}

				platformGridAPI.events.register($scope.gridId, 'onInitialized', setLoad);

				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onInitialized', setLoad);
					unSetGridReadOnly($scope.gridUUID);
				});
			}
		}
	]);
})(angular);
