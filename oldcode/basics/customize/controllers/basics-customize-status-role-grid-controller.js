(function (angular) {
	'use strict';

	var moduleName = 'basics.customize';

	/**
	 @ngdoc controller
	 * @name basicsCustomizeStatusRoleGridController
	 * @function
	 *
	 * @description
	 * Controller for the Document Properties Structure Details view.
	 */
	/* jshint -W072 */ // function has too many parameters
	angular.module(moduleName).controller('basicsCustomizeStatusRoleGridController',
		['$scope', '$timeout', 'platformGridAPI', 'platformCreateUuid', 'basicsCustomizeStatusRoleDataService', 'basicsCustomizeInstanceConfigurationService', '$translate', 'basicsCustomizeStatusTransitionService',
			function ($scope, $timeout, platformGridAPI, platformCreateUuid, basicsCustomizeStatusRoleDataService, basicsCustomizeInstanceConfigurationService, $translate, basicsCustomizeStatusTransitionService) {

				var dataType = basicsCustomizeStatusRoleDataService.getDataType();
				var gridColumns = basicsCustomizeInstanceConfigurationService.getListConfigForType(dataType, [basicsCustomizeStatusRoleDataService.getStatusRuleField()]).columns;

				$scope.gridId = platformCreateUuid();
				$scope.roleNotAvailable = true;
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

				function onCellModified(/*e, arg*/) {
					basicsCustomizeStatusRoleDataService.addEntityToModified(null, basicsCustomizeStatusRoleDataService.getSelected());
				}

				function updateButtons() {
					angular.forEach($scope.tools.items, function (item) {
						item.disabled = !(item.id === 't1' && basicsCustomizeStatusRoleDataService.canCreate() ||
							item.id === 't2' && basicsCustomizeStatusRoleDataService.canDelete());
					});
				}

				function onSelectedRowsChanged(/*e, arg*/) {
					var selected = platformGridAPI.rows.selection({
						gridId: $scope.gridId
					});
					selected = _.isArray(selected) ? selected[0] : selected;
					basicsCustomizeStatusRoleDataService.setSelected(selected);
					updateButtons();
				}

				if (!platformGridAPI.grids.exist($scope.gridId)) {
					var gridConfig = {
						data: basicsCustomizeStatusRoleDataService.getFilteredList(),
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
					basicsCustomizeStatusRoleDataService.createItem();
				};

				$scope.deleteItem = function () {
					basicsCustomizeStatusRoleDataService.deleteItem(basicsCustomizeStatusRoleDataService.getSelected());
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
					angular.forEach($scope.tools.items, function (item) {
						item.disabled = (isEditable) ? false : true;
					});
				}

				$timeout(function () {
					var readOnly = true;
					editTools(!readOnly);
					//platformGridAPI.grids.resize($scope.gridId);
				});

				function updateItemList() {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.items.data($scope.gridId, basicsCustomizeStatusRoleDataService.getFilteredList());
					}
					$scope.roleNotAvailable = (_.isEmpty(basicsCustomizeStatusRoleDataService.getSelectedParentItem())) ? true : false;
					//$scope.info = $translate.instant('basics.customize.actionNotAllowed');
					updateButtons();
				}

				function onEntityCreated(e, entity) {
					platformGridAPI.rows.scrollIntoViewByItem($scope.gridId, entity, true);
				}

				if (basicsCustomizeStatusRoleDataService.registerEntityCreated) {
					basicsCustomizeStatusRoleDataService.registerEntityCreated(onEntityCreated);
				}

				basicsCustomizeStatusRoleDataService.registerListLoaded(updateItemList);
				basicsCustomizeStatusTransitionService.registerHasRoleValidationChangedCallback(updateButtons);

				$scope.$on('$destroy', function () {
					basicsCustomizeStatusTransitionService.unregisterHasRoleValidationChangedCallback(updateButtons);
					platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellModified);
					platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
					basicsCustomizeStatusRoleDataService.unregisterListLoaded(updateItemList);
					if (basicsCustomizeStatusRoleDataService.unregisterEntityCreated) {
						basicsCustomizeStatusRoleDataService.unregisterEntityCreated(onEntityCreated);
					}
				});
			}
		]);
})(angular);
