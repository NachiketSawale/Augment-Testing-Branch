/**
 * Created by joshi on 14.08.2014.
 */
(function () {
	/*global angular*/
	'use strict';

	var moduleName = 'basics.customize';

	/**
	 @ngdoc controller
	 * @name basicsCustomizeStatusWorkflowGridController
	 * @function
	 *
	 * @description
	 * Controller for the Document Properties Structure Details view.
	 */
	/* jshint -W072 */ // function has too many parameters
	angular.module(moduleName).controller('basicsCustomizeStatusWorkflowGridController',
		['$scope', '$timeout', 'platformGridAPI', 'platformCreateUuid', 'basicsCustomizeStatusWorkflowStepDataService', 'basicsCustomizeInstanceConfigurationService', '$translate','_',
			function ($scope, $timeout, platformGridAPI, platformCreateUuid, basicsCustomizeStatusWorkflowStepDataService, basicsCustomizeInstanceConfigurationService, $translate, _) {

				var dataType = basicsCustomizeStatusWorkflowStepDataService.getDataType();
				var gridColumns = basicsCustomizeInstanceConfigurationService.getListConfigForType(dataType, [basicsCustomizeStatusWorkflowStepDataService.getStatusRuleField()]).columns;

				$scope.gridId = platformCreateUuid();
				$scope.workflowNotAvailable = true;
				$scope.info = $translate.instant('basics.customize.selectCell');
				var initGridColumns = function () {
					// add translation to the column name
					angular.forEach(gridColumns, function (value) {
						if (angular.isUndefined(value.name$tr$)) {
							value.name$tr$ = moduleName + '.' + value.field;
						}
					});
				};

				initGridColumns();

				function updateButtons(){
					angular.forEach($scope.tools.items, function (item) {

						item.disabled = !(item.id === 't1' && basicsCustomizeStatusWorkflowStepDataService.canCreate() ||
						item.id === 't2' && basicsCustomizeStatusWorkflowStepDataService.canDelete());
					});
				}

				function onCellModified(/*e, arg*/) {
					basicsCustomizeStatusWorkflowStepDataService.addEntityToModified(null, basicsCustomizeStatusWorkflowStepDataService.getSelected());
				}

				function onSelectedRowsChanged(/*e, arg*/) {
					var selected = platformGridAPI.rows.selection({
						gridId: $scope.gridId
					});
					selected = _.isArray(selected) ? selected[0] : selected;
					basicsCustomizeStatusWorkflowStepDataService.setSelected(selected);
					updateButtons();
				}

				if (!platformGridAPI.grids.exist($scope.gridId)) {
					var gridConfig = {
						data: basicsCustomizeStatusWorkflowStepDataService.getFilteredList(),
						columns: angular.copy(gridColumns),
						id: $scope.gridId,
						lazyInit: true,
						options: {
							tree: false, indicator: true, allowRowDrag: false,
							editable: true,
							asyncEditorLoading: true,
							autoEdit: false,
							enableCellNavigation: true,
							enableColumnReorder: false,
							selectionModel: new Slick.RowSelectionModel(),
							showItemCount: false
							//autoHeight: true
						}
					};

					platformGridAPI.grids.config(gridConfig);
					platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellModified);
					platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

				} else {
					platformGridAPI.columns.configuration($scope.gridId, angular.copy(gridColumns));
				}

				$scope.gridData = {
					state: $scope.gridId
				};

				$scope.createItem = function () {
					basicsCustomizeStatusWorkflowStepDataService.createItem();
				};

				$scope.deleteItem = function () {
					basicsCustomizeStatusWorkflowStepDataService.deleteItem(basicsCustomizeStatusWorkflowStepDataService.getSelected());
				};

				// Define standard toolbar Icons and their function on the scope
				$scope.tools = {
					showImages: false,
					showTitles: true,
					cssClass: 'tools',
					items: [
						{
							id: 't1',
							sort: 0,
							caption: 'cloud.common.taskBarNewRecord',
							type: 'item',
							iconClass: 'tlb-icons ico-rec-new',
							fn: $scope.createItem,
							disabled: true
						},
						{
							id: 't2',
							sort: 10,
							caption: 'cloud.common.taskBarDeleteRecord',
							type: 'item',
							iconClass: 'tlb-icons ico-rec-delete',
							fn: $scope.deleteItem,
							disabled: true
						}
					]
				};

				// set toolbar items editable or readonly
				function editTools(isEditable) {
					_.each($scope.tools.items, function (item) {
						item.disabled = (isEditable) ? false : true;
					});
				}

				$timeout(function () {
					editTools(false);
				});

				function updateItemList(){
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.items.data($scope.gridId, basicsCustomizeStatusWorkflowStepDataService.getFilteredList());
					}
					$scope.workflowNotAvailable = (_.isEmpty(basicsCustomizeStatusWorkflowStepDataService.getSelectedParentItem())) ? true : false;
					//$scope.info = $translate.instant('basics.customize.actionNotAllowed');
					updateButtons();
				}


				function onEntityCreated(e, entity) {
					platformGridAPI.rows.scrollIntoViewByItem($scope.gridId, entity, true);
				}

				if (basicsCustomizeStatusWorkflowStepDataService.registerEntityCreated) {
					basicsCustomizeStatusWorkflowStepDataService.registerEntityCreated(onEntityCreated);
				}

				basicsCustomizeStatusWorkflowStepDataService.registerListLoaded(updateItemList);


				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellModified);
					platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
					basicsCustomizeStatusWorkflowStepDataService.unregisterListLoaded(updateItemList);
					if (basicsCustomizeStatusWorkflowStepDataService.unregisterEntityCreated) {
						basicsCustomizeStatusWorkflowStepDataService.unregisterEntityCreated(onEntityCreated);
					}
				});
			}
		]);
})();