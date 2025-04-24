/**
 * Created by xsi on 2016-03-11.
 */
(function (angular) {
	'use strict';
	/* global _ */
	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc controller
	 * @name constructionSystemMainHeaderListController
	 * @requires $scope
	 * @description
	 * #
	 * Controller for constructionsystem main master grid.
	 */
	angular.module(moduleName).controller('constructionSystemMainHeaderListController', [
		'$scope', 'platformGridControllerService', 'constructionSystemMasterHeaderUIStandardService',
		'constructionSystemMainHeaderService', 'constructionSystemMainClipboardService', 'platformGridAPI',
		'basicsCommonHeaderColumnCheckboxControllerService',
		'platformRuntimeDataService',
		function ($scope, platformGridControllerService, constructionSystemMasterHeaderUIStandardService,
			dataService, cosMainClipboardService, platformGridAPI,
			basicsCommonHeaderColumnCheckboxControllerService,
				  platformRuntimeDataService) {

			var listConfig = angular.copy(constructionSystemMasterHeaderUIStandardService.getStandardConfigForListView());

			// set all grid columns readonly
			_.each(listConfig.columns, function (col) {
				if (col.editor) {
					col.editor = null;
					if (col.editorOptions) {
						col.editorOptions = null;
					}
				}

				// add navigator
				if (col.id === 'code') {
					col.navigator = {
						moduleName: 'constructionsystem.master'
					};
				}
			});

			const checkField = 'IsChecked';

			// add new 'checkbox' column
			listConfig.columns.unshift({
				id: 'IsChecked',
				field: checkField,
				name$tr$: 'cloud.common.entityChecked',
				formatter: 'boolean',
				editor: 'boolean',
				width: 65,
				headerChkbox: true,
				validator: 'isCheckedValueChange',
				sortable: false
			},
			{
				id:'IsUserModified',
				field: 'IsChecked',
				name$tr$:'constructionsystem.main.common.isUserModified',
				formatter:'boolean',
				editor:'boolean',
				width:65,
				headerChkbox: false,
				sortable: true

			},
			{
				id: 'costemplatefk',
				field: 'CosTemplateFk',
				name$tr$: 'constructionsystem.master.entityTemplateFk',
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'CosTemplate',
					displayMember: 'DescriptionInfo.Translated'
				},
				editor: 'lookup',
				editorOptions: {
					directive: 'construction-system-master-template-combobox',
					valueMember: 'Id',
					displayMember: 'DescriptionInfo.Translated',
					lookupOptions: {
						filterKey: 'construction-system-main-instance-master-template-filter',
						showClearButton: true,
						'events':[
							{
								name: 'onSelectedItemChanged',
								handler: function (e, args) {
									var entity = args.entity;
									if(args.selectedItem !== null){
										dataService.saveSelectedTemplate(entity.Id, args.selectedItem.Id);
									}
									else{
										dataService.saveSelectedTemplate(entity.Id, null);
									}
								}
							}
						]
					}
				}
			});

			let checkBoxOptions = {
				useFilteredData: true
			};

			$scope.isCheckedValueChange = function (entity, value, model) {
				const result = dataService.isCheckedValueChange(entity, value, model);
				setTimeout(function () {
					basicsCommonHeaderColumnCheckboxControllerService.checkHeaderCheckBox($scope.gridId, [checkField], checkBoxOptions);
				});
				return true;
			}

			var uiConfigService = {
				getStandardConfigForListView: function () {
					return listConfig;
				}
			};

			platformGridControllerService.initListController($scope, uiConfigService, dataService, {}, {
				type: 'cosMasterHeader',
				dragDropService: cosMainClipboardService,
				extendDraggedData: function (draggedData) {
					draggedData.modelDataSource = cosMainClipboardService.myDragdropAdapter;
				}
			});

			$scope.ddTarget.registerDragStarted(function () {
				cosMainClipboardService.setDropMessageToViewer('create instance');
			});

			// remove toolbars
			var removeItems = ['create', 'delete', 'createChild'];
			$scope.tools.items = _.filter($scope.tools.items, function (item) {
				return item && removeItems.indexOf(item.id) === -1;
			});

			platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', getSelectedItems);
			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', getSelectedItems);
			});

			/**
			 * get the selected items.
			 * currently, the platformGridAPI has no direct method to get multiple selected items.
			 */
			function getSelectedItems(e, arg) {
				var rowItems = platformGridAPI.rows.getRows($scope.gridId);
				var selectedItems = [];
				if (arg) {
					angular.forEach(arg.rows, function (row) {
						var item = rowItems[row];
						if (item) {
							selectedItems.push(item);
						}
					});
				}
				dataService.selectedItems = selectedItems;
			}

			const headerCheckBoxEvents = [
				{
					// after the filter is changed, trigger to update the state of the header check box
					source: 'grid',
					name: 'onFilterChanged'
				},
				{
					// after the items count is changed, trigger to update the state of the header check box
					source: 'grid',
					name: 'onItemCountChanged'
				},
				{
					// the header check box only effects the is checked value of the items shown in UI.
					source: 'grid',
					name: 'onHeaderCheckboxChanged',
					fn: function (e) {
						let list = dataService.getList();
						let value = (e.target.checked);
						let previousCheckStatus = dataService.itemCheckStatusPrevious;
						let gridInstance = platformGridAPI.grids.element('id', $scope.gridId).instance;
						if (gridInstance) {
							// get the items filtered
							let filteredItems = gridInstance.getData().getFilteredItems().rows || [];
							if (filteredItems.length < list.length) {
								// revert the is checked value of all items changed to the previous
								list.forEach(function (item) {
									const previousValue = previousCheckStatus[item.Id];
									if (previousValue !== undefined && previousValue !== item[checkField]) {
										// the validation is required when the value is changed.
										let result = dataService.isCheckedValueChange(item, previousValue, checkField);
										platformRuntimeDataService.applyValidationResult(result, item, checkField);
										item[checkField] = previousValue;
									}
								});

								// set the is checked value of the filtered items (items shown in UI)
								filteredItems.forEach(function (item) {
									// do as checkbox-column, when changing the value, check readonly and validation
									let rowItemReadOnly = platformRuntimeDataService.isReadonly(item, checkField);
									if (!rowItemReadOnly) {
										let result = dataService.isCheckedValueChange(item, value, checkField);
										platformRuntimeDataService.applyValidationResult(result, item, checkField);

										if (result === true || result.valid) {
											item[checkField] = value;
											gridInstance.invalidateRow(gridInstance.getData().getIdxById(item.Id));
										}
									}
								});
							}
						}
						// after value is changed, clear the cache
						dataService.clearItemCheckStatusPrevious();
					}
				}
			];

			basicsCommonHeaderColumnCheckboxControllerService.setGridId($scope.gridId);
			basicsCommonHeaderColumnCheckboxControllerService.init($scope, dataService, [checkField], headerCheckBoxEvents, checkBoxOptions);
		}
	]);
})(angular);
