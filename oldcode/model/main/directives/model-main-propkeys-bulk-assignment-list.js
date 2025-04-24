/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc directive
	 * @name model.main.directive:modelMainPropkeysBulkAssignmentList
	 * @element div
	 * @restrict A
	 * @description A directive that displays a grid for entering property key values.
	 */
	angular.module('model.main').directive('modelMainPropkeysBulkAssignmentList',
		modelMainPropkeysBulkAssignmentList);

	modelMainPropkeysBulkAssignmentList.$inject = ['_', 'moment', 'platformGridAPI',
		'basicsLookupdataConfigGenerator', 'platformTranslateService', 'platformRuntimeDataService',
		'modelMainPropertyDataService', 'modelAdministrationPropertyKeyDataService'];

	function modelMainPropkeysBulkAssignmentList(_, moment, platformGridAPI,
		basicsLookupdataConfigGenerator, platformTranslateService, platformRuntimeDataService,
		modelMainPropertyDataService, modelAdministrationPropertyKeyDataService) {

		return {
			restrict: 'A',
			scope: {
				model: '='
			},
			templateUrl: globals.appBaseUrl + 'model.main/templates/model-main-propkeys-bulk-assignment-list-template.html',
			compile: function () {
				return {
					pre: function ($scope) {
						$scope.dataItem = $scope.model;

						$scope.gridId = '564404a9c4da421191ca92fe7d73c810';
						$scope.gridData = {
							state: $scope.gridId
						};

						if (platformGridAPI.grids.exist($scope.gridId)) {
							platformGridAPI.grids.unregister($scope.gridId);
						}

						const gridConfig = {
							data: [],
							lazyInit: true,
							enableConfigSave: false,
							columns: [{
								id: 'pk',
								field: 'PropertyKeyFk',
								width: 200,
								name$tr$: 'model.main.propertyKey',
								sortable: true,
								editor: 'lookup',
								editorOptions: {
									directive: 'model-main-property-key-dialog'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PropertyKey',
									displayMember: 'PropertyName',
									version: 3
								}
							}, {
								id: 'delete',
								field: 'Delete',
								width: 90,
								name$tr$: 'model.main.propKeysBulkAssignment.delete',
								sortable: true,
								editor: 'boolean',
								formatter: 'boolean'
							}, {
								id: 'value',
								field: 'Value',
								width: 200,
								name$tr$: 'model.main.propertyValue',
								sortable: true,
								formatter: 'dynamic',
								editor: 'dynamic',
								domain: function (item) {
									let domain;

									if (item) {
										switch (item.valueType) {
											case 1:
												domain = 'remark';
												break;

											case 2:
												domain = 'decimal';
												break;

											case 3:
												domain = 'integer';
												break;

											case 4:
												domain = 'boolean';
												break;

											case 5:
												domain = 'dateutc';
												break;
										}
									}

									return domain || 'description';
								}
							}, _.assign(basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForGrid({
								dataServiceName: 'basicsUnitLookupDataService',
								cacheEnable: true,
								additionalColumns: false
							}), {
								id: 'uomfk',
								field: 'UoMFk',
								width: 120,
								name$tr$: 'cloud.common.entityUoM',
								sortable: true
							})],
							id: $scope.gridId,
							options: {
								skipPermissionCheck: true,
								tree: false,
								indicator: false,
								idProperty: 'id',
								enableColumnReorder: false
							}
						};
						platformTranslateService.translateObject(gridConfig.columns, 'name');
						platformGridAPI.grids.config(gridConfig);

						let nextItemId = -1;

						function createNewItem() {
							const result = {
								id: nextItemId--,
								PropertyKeyFk: null,
								PropertyValueText: '',
								PropertyValueNumber: 0,
								PropertyValueLong: 0,
								PropertyValueBool: false,
								PropertyValueDate: moment().set({'year': 1, 'month': 0, 'date': 1}),
								UoMFk: null,
								Delete: false
							};
							setItemValueReadOnly(result, true);
							return result;
						}

						function setItemValueReadOnly(item, isReadOnly) {
							platformRuntimeDataService.readonly(item, _.map(_.concat([
								'Value'
							], _.map(modelMainPropertyDataService.getAllValueTypes(), function (vt) {
								return modelMainPropertyDataService.valueTypeToPropName(vt);
							})), function (propName) {
								return {
									field: propName,
									readonly: !!isReadOnly
								};
							}));
						}

						function updateItemReadOnlyState(item) {
							setItemValueReadOnly(item, item.Delete || !_.isNumber(item.valueType));
							platformRuntimeDataService.readonly(item, [{
								field: 'UoMFk',
								readonly: item.Delete
							}]);
						}

						if (_.isEmpty($scope.dataItem.Values)) {
							$scope.dataItem.Values = [createNewItem()];
						}

						$scope.tools = {
							showImages: true,
							showTitles: true,
							cssClass: 'tools',
							items: [{
								id: 'add',
								caption: 'cloud.common.toolbarInsert',
								iconClass: 'tlb-icons ico-rec-new',
								type: 'item',
								fn: function () {
									const rowItem = createNewItem();

									platformGridAPI.rows.add({gridId: $scope.gridId, item: rowItem});
									platformGridAPI.rows.scrollIntoViewByItem($scope.gridId, rowItem);
								}
							}, {
								id: 'delete',
								caption: 'cloud.common.toolbarDelete',
								iconClass: 'tlb-icons ico-rec-delete',
								type: 'item',
								fn: function () {
									const selItem = platformGridAPI.rows.selection({gridId: $scope.gridId});

									platformGridAPI.rows.delete({
										gridId: $scope.gridId,
										item: selItem
									});

									platformGridAPI.grids.refresh($scope.gridId, true);
								},
								disabled: function () {
									return !platformGridAPI.rows.selection({gridId: $scope.gridId});
								}
							}],
							update: function () {
								this.version++;
							},
							refresh: function () {
								this.refreshVersion++;
							}
						};

						platformGridAPI.items.data($scope.gridId, $scope.dataItem.Values);

						platformGridAPI.events.register($scope.gridId, 'onCellChange', function ($event, cellInfo) {
							switch (cellInfo.grid.getColumns()[cellInfo.cell].id) {
								case 'pk':
									cellInfo.item.valueType = null;
									updateItemReadOnlyState(cellInfo.item);
									if (_.isNumber(cellInfo.item.PropertyKeyFk)) {
										modelAdministrationPropertyKeyDataService.getValueTypeByPropertyKeyId(cellInfo.item.PropertyKeyFk).then(function (valueType) {
											cellInfo.item.valueType = valueType;

											const propName = modelMainPropertyDataService.valueTypeToPropName(cellInfo.item.valueType);
											if (propName) {
												cellInfo.item.Value = cellInfo.item[propName];
											}

											updateItemReadOnlyState(cellInfo.item);
										});
									}
									break;
								case 'value':
									(function valueUpdated() {
										const propName = modelMainPropertyDataService.valueTypeToPropName(cellInfo.item.valueType);
										if (propName) {
											cellInfo.item[propName] = cellInfo.item.Value;
										}
									})();
									break;
								case 'delete':
									updateItemReadOnlyState(cellInfo.item);
									break;
							}
						});

						$scope.$on('$destroy', function () {
							platformGridAPI.grids.unregister($scope.gridId);
						});
					}
				};
			}
		};
	}
})(angular);
