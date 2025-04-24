/**
 * Created by reimer on 28.07.2015.
 */

(function () {

	/*global angular, _*/

	'use strict';

	var moduleName = 'basics.import';

	/**
	 * @ngdoc controller
	 * @name basicsImportWizardController
	 * @function
	 *
	 * @description
	 *
	 **/

	angular.module(moduleName).controller('basicsImportCustomGridController', [
		'$scope', '$timeout', '$translate', 'platformGridAPI', 'platformTranslateService','platformRuntimeDataService',

		function ($scope, $timeout, $translate, platformGridAPI, platformTranslateService,platformRuntimeDataService) {
			let mode = $scope.mode;
			let translate = $scope.transLate;
			let destinationFields = _.map(($scope.destinationFields || []), function (destinationField) {
				return {Id: destinationField, Description: destinationField};
			});

			let dataProps = [];
			let columnName = [];
			if ($scope.columnName) {
				columnName = $scope.columnName;
				_.forOwn($scope.sourceFields || [], function (value, key) {
					dataProps.push(value);
				});
			} else {
				_.forOwn($scope.sourceFields || [], function (value, key) {
					dataProps.push(key);
				});
			}

			let sourceFields = _.map(dataProps, function (sourceField) {
				if (columnName !== undefined && columnName.length > 0) {
					return {Id: sourceField, Description: translate === 1 ? sourceField : sourceField};
				} else {
					return {Id: sourceField, Description: translate === 1 ? $translate.instant('boq.main.' + sourceField) : $translate.instant('estimate.main.' + sourceField)};
				}

			});
			let gridColumns = [];
			let gridData = [];
			if (mode === 1) {
				gridColumns = [
					{
						id: 1,
						field: 'SourceFieId',
						name: 'Destination Field',
						name$tr$: 'estimate.main.DestinationField',
						readonly: false,
						formatter: 'select',
						formatterOptions: {
							items: sourceFields,
							valueMember: 'Id',
							displayMember: 'Description'
						},
						width: 260,
						editor: 'select',
						editorOptions: {
							displayMember: 'Description',
							valueMember: 'Id',
							items: sourceFields
						}
					},
					{
						id: 2,
						field: 'DesctinationFieId',
						name: 'Excel Title FieId',
						name$tr$: 'estimate.main.ExcelTitleFieId',
						readonly: false,
						editor: 'select',
						formatter: 'select',
						formatterOptions: {
							items: destinationFields,
							valueMember: 'Id',
							displayMember: 'Description'
						},
						width: 260,
						editorOptions: {
							displayMember: 'Description',
							valueMember: 'Id',
							items: destinationFields
						}
					}
				];
				if ($scope.gridData) {
					gridData = $scope.gridData;
				}

			} else if (mode === 2) {
				destinationFields = _.map(($scope.destinationFields || []), function (destinationField) {
					return {Id: destinationField.Id, Description: destinationField.Uom};
				});
				gridData = $scope.gridData;
				gridColumns = [
					{
						id: 1,
						field: 'Code',
						name: columnName.length > 0 ? columnName[0] :'Code',
						formatter: 'description',
						width: 120,
						//name$tr$: 'basics.import.Code'
					},
					{
						id: 2,
						field: 'Description',
						name: columnName.length > 1 ? columnName[1] :'Description',
						formatter: 'description',
						width: 180,
						//name$tr$: 'basics.import.Description'
					},
					{
						id: 3,
						field: 'Uom',
						name: columnName.length > 2 ? columnName[2] :'UoM(import)',
						formatter: 'description',
						width: 100,
						//name$tr$: 'basics.import.Uom'
					},
					{
						id: 4,
						field: 'BasUom',
						name: columnName.length > 3 ? columnName[3] :'UoM(verify)',
						//name$tr$: 'basics.import.BasUom',
						readonly: false,
						editor: 'select',
						formatter: 'select',
						formatterOptions: {
							items: destinationFields,
							valueMember: 'Id',
							displayMember: 'Description'
						},
						width: 100,
						editorOptions: {
							displayMember: 'Description',
							valueMember: 'Id',
							items: destinationFields
						}
					}
				];
			}else  if(mode === 3)
			{
				gridData = $scope.gridData;
				gridColumns = [
					{
						id: 1,
						field: 'Code',
						name:  columnName.length > 0 ? columnName[0] :'Excel Resource Code',
						formatter: 'description',
						width: 280,
						//name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: '2',
						field: 'MaterialCode',
						name:  columnName.length > 0 ? columnName[1] :'Material Code',
						name$tr$: 'Material Code',
						editor: 'lookup',
						width: 280,
						editorOptions: {
							directive: 'estimate-main-material-lookup',
							lookupOptions: {
												showClearButton: true,
												additionalColumns: false,
												displayMember: 'Code',
												valueMember: 'Id',
												filterOptions: {},
												events: [
													{
														name: 'onSelectedItemChanged',
														handler: function (e, args) {
															if (args.selectedItem !== null){
																args.entity.MdcMaterialFk = args.selectedItem.Id;
															}
														}
													}
												],
											}
										}
									}];
			}
			else {
				gridData = $scope.gridData;
				gridColumns = _.filter($scope.gridColumns, function (colum) {
					if (colum.DesctinationFieId) {
						return true;
					} else {
						return false;
					}
				});
				gridColumns = _.map(gridColumns, function (column) {
					return {
						id: column.Id,
						field: column.SourceFieId + '_New',
						name: column.SourceFieId,
						formatter: 'description',
						width: 150,
						//name$tr$: 'cloud.common.entityDescription'
					};
				});
			}

			$scope.tools = {
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: [
					{
						id: 'create',
						sort: 0,
						caption: 'cloud.common.taskBarNewRecord',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-new',
						fn: function () {
							if (mode === 1) {
								let index = gridData.length + 1;
								platformGridAPI.rows.add({gridId: $scope.gridId, item: {Ix: index}});
							}
						},
						disabled: mode === 1?false:true
					},
					{
						id: 'delete',
						sort: 1,
						caption: 'cloud.common.taskBarDeleteRecord',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-delete',
						fn: function () {
							if (mode === 1) {
								var selectedEntity = platformGridAPI.rows.selection({
									gridId: $scope.gridId,
									wantsArray: false
								});
								platformGridAPI.rows.delete({gridId: $scope.gridId, item: selectedEntity});
							}
						},
						disabled: mode === 1?false:true
					}
				],
				update: function () {
					return;
				}
			};

			$scope.gridId = '3a55b53e9555453596e83acf9830c799';

			$scope.gridData = {
				state: $scope.gridId
			};

			_.map(gridData, function (item) {
				if(item.BasUom ===''){
					platformRuntimeDataService.applyValidationResult({
						valid: false,
						error: 'The UoM should not be null',
						error$tr$: 'estimate.main.importUomErrorMessage'
					}, item, 'BasUom');
				}

			});
			platformGridAPI.grids.refresh($scope.gridId, true);
			resizeGrid();

			function resizeGrid() {
				platformGridAPI.grids.resize($scope.gridId);
			}

			if (!platformGridAPI.grids.exist($scope.gridId)) {
				let gridConfig = {
					data: [],
					columns: angular.copy(gridColumns),
					id: $scope.gridId,
					lazyInit: false,
					isStaticGrid: true,
					options: {
						tree: false, indicator: true,
						multiSelect: false,
						idProperty: 'Ix'
					},
					enableConfigSave: true
				};

				platformGridAPI.grids.config(gridConfig);
				platformTranslateService.translateGridConfig(gridConfig.columns);

				// initialize();
			} else {
				platformGridAPI.columns.configuration($scope.gridId, angular.copy(gridColumns));

				// initialize();
			}

			platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellModified);
			$timeout(function () {
				platformGridAPI.items.data($scope.gridId, gridData);
				platformGridAPI.grids.resize($scope.gridId);
			});
			$scope.$on('$destroy', function () {


				platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellModified);
			});

			function onCellModified(e, arg) {
				if(arg.item.BasUom!==''){
					platformRuntimeDataService.applyValidationResult({
						valid: true,
						error: 'The UoM should not be null',
						error$tr$: 'estimate.main.importUomErrorMessage'
					}, arg.item, 'BasUom');
					platformGridAPI.grids.refresh($scope.gridId, true);
					resizeGrid();
				}
			}
		}
	]);
})();
